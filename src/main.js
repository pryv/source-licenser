const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const loadConfig = require('./loadConfig');
const substitutions = require('./substitutions');
const actions = require('./actions');
const { exit } = require('process');

(async () => {
  // parse command line args
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options] <target directory>')
    .demandOption('c', 'You must specify the configuration file')
    .demandCommand(1, 'You must specify the target directory')
    .option('c', {
      alias: 'config-file',
      describe: 'Configuration file',
      type: 'string',
      nargs: 1
    })
    .help('help')
    .alias('v', 'version')
    .argv;

  // make sure specified files exist

  const configFilePath = path.resolve(argv.configFile);
  if (!fs.existsSync(configFilePath)) {
    exitWithError(`Config file '${argv.config}' not found`);
  }
  const targetDirPath = path.resolve(argv._[0]);
  if (!fs.existsSync(targetDirPath) || !fs.lstatSync(targetDirPath).isDirectory()) {
    exitWithError(`'${argv._}' not found or not a directory`);
  }

  const config = loadConfig(configFilePath);

  substitutions.init(config.substitutions);
  const defaultLicense = substitutions.apply(config.license);

  const files = {};
  for (const [pattern, fileActionsConfig] of Object.entries(config.files)) {
    files[pattern] = [];
    for (const [actionId, actionSettings] of Object.entries(fileActionsConfig)) {
      if (!actions[actionId]) {
        throw new Error(`Unknown action '${actionId}'`);
      }
      const action = Object.create(actions[actionId]);
      action.init(substitutions.apply(actionSettings), defaultLicense);
      files[pattern].push(action);
      console.debug(`Prepared action: ${pattern} ← ${actionId}`);
    }
  }

  console.log();

  const startTime = Date.now();
  let totalCount = 0;
  let updatedCount = 0;

  const globOptions = {
    cwd: targetDirPath,
    ignore: config.ignore
  };
  for (const [pattern, fileActions] of Object.entries(files)) {
    const matches = await glob(pattern, globOptions);
    if (matches.length === 0) {
      console.log(`Warning: found no file matching '${pattern}'`);
    }
    for (const filePath of matches) {
      for (const action of fileActions) {
        const changed = await action.apply(path.join(targetDirPath, filePath));
        totalCount++;
        if (changed) {
          console.log(`File updated: ${filePath} (${action.id})`);
          updatedCount++;
        }
      }
    }
  }

  const elapsedTime = Math.round((Date.now() - startTime) / 10) / 100;
  console.log(`\nChecked ${totalCount} files, updated ${updatedCount} in ${elapsedTime}s`);
})();

function exitWithError (message) {
  console.error(`Error: ${message}`);
  exit(1);
}
