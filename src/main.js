const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const logger = require('./logger');
const loadConfig = require('./loadConfig');
const substitutions = require('./substitutions');
const actions = require('./actions');
const { exit } = require('process');

(async () => {
  // parse command line args
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options] <target directory>')
    .demandOption('c', logger.formatError('You must specify the configuration file'))
    .demandCommand(1, logger.formatError('You must specify the target directory'))
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
    logger.error(`Config file '${argv.configFile}' not found`);
    exit(1);
  }
  const targetDirPath = path.resolve(argv._[0]);
  if (!fs.existsSync(targetDirPath) || !fs.lstatSync(targetDirPath).isDirectory()) {
    logger.error(`'${argv._}' not found or not a directory`);
    exit(1);
  }

  logger.heading('Initializing...');

  let config;
  try {
    config = loadConfig(configFilePath);
  } catch (e) {
    logger.error(`Could not load configuration file: ${e.message}`);
    exit(1);
  }

  substitutions.init(config.substitutions);

  const files = {};
  try {
    const defaultLicense = substitutions.apply(config.license);

    for (const [pattern, fileActionsConfig] of Object.entries(config.files)) {
      files[pattern] = [];
      for (const [actionId, actionSettings] of Object.entries(fileActionsConfig)) {
        if (!actions[actionId]) {
          throw new Error(`Unknown action '${actionId}'`);
        }
        const action = Object.create(actions[actionId]);
        action.init(substitutions.apply(actionSettings), defaultLicense);
        files[pattern].push(action);
      }
      logger.debug(`✓ ${pattern} → ${Object.keys(fileActionsConfig).join(', ')}`);
    }
  } catch (e) {
    logger.error(`Initialization failed: ${e.message}`);
    exit(1);
  }

  logger.heading('\nGo!');

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
      logger.warning(`Found no file matching '${pattern}'`);
    }
    for (const filePath of matches) {
      for (const action of fileActions) {
        const changed = await action.apply(path.join(targetDirPath, filePath));
        totalCount++;
        if (changed) {
          logger.info(`✓ ${filePath} updated (${action.id})`);
          updatedCount++;
        } else {
          logger.debug(`· ${filePath} skipped, already up-to-date (${action.id})`);
        }
      }
    }
  }

  const elapsedTime = Math.round((Date.now() - startTime) / 10) / 100;
  logger.info(`\nUpdated ${updatedCount} out of ${totalCount} files in ${elapsedTime}s`);
})();
