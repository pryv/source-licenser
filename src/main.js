const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');
const path = require('path');
const loadConfig = require('./loadConfig');
const _ = require('lodash');

// parse command line args
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options] <target directory>')
  .demandOption('c', 'You must specify the configuration file')
  .demandCommand(1, 'You must specify the target directory')
  .option('c', {
    alias: 'config-file',
    describe: 'Configuration file',
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
const ignore = config.ignore;
const files = config.files;
const filesKeys = Object.keys(files);

let count = 0;
let updated = 0;
const startTime = Date.now();

(async () => {
  await applySubstitutions();

  await loadAction(require('./actions/header'));
  await loadAction(require('./actions/json'));
  await loadAction(require('./actions/siblingLicenseFile'));
  await loadAction(require('./actions/footer'));

  checkInit();

  await loop(targetDirPath);
  console.log(`${count} files checked, ${updated} updated in ${Math.round((Date.now() - startTime) / 10) / 100}s`);
})();

// details

async function applySubstitutions () {
  // -- get YEARS values TODO clean that up
  const years = config.substitutions.YEARS;
  const now = new Date();

  if (!years.start || years.start === 'CURRENT_YEAR') years.start = now.getFullYear();
  let YEARS = years.start;
  if (!years.end || years.end === 'CURRENT_YEAR') years.end = now.getFullYear();
  if (years.start !== years.end) {
    YEARS = years.start + '–' + years.end;
  }
  config.substitutions.YEARS = YEARS;

  const substitutions = config.substitutions;

  // -- apply template on LICENSE TEXT
  _.templateSettings.interpolate = /{([A-Z_]+)}/g;
  config.license = _.template(config.license)(substitutions);

  // -- apply template on strings founds in files
  substituteInStringValues(config, 'files');
  function substituteInStringValues (obj, key) {
    const val = obj[key];
    if (!val) {
      return;
    }
    if (typeof val === 'string') {
      obj[key] = _.template(val)(substitutions);
      return;
    }
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        // not handled
        return;
      }
      for (const k of Object.keys(val)) {
        substituteInStringValues(val, k);
      }
    }
  }
}

async function loadAction (action) {
  // -- prepare actions
  for (const specKey of filesKeys) { // for each type of file "*.js", "README.md", ....
    const fileSpec = files[specKey];
    for (const actionKey of Object.keys(fileSpec)) { // for each found action ("footer", "json", ...)
      if (actionKey === action.key) {
        if (typeof fileSpec[actionKey] === 'boolean' && fileSpec[actionKey]) {
          fileSpec[actionKey] = {};
        }
        await action.prepare(fileSpec[actionKey], config.license);
        console.log(`Prepared '${action.key}' for '${specKey}'`);
      }
    }
  }
}

function checkInit () {
  for (const specKey of filesKeys) {
    for (const actionKey of Object.keys(files[specKey])) {
      const actionItem = files[specKey][actionKey];
      if (!actionItem.actionMethod) {
        exitWithError(`Handler '${actionItem.action}' for '${specKey}:${actionKey}' has not been initialized`);
      }
    }
  }
}

/**
 * Software entrypoint
 * Loop recursively in the directory
 * - ignore files or dir matching one of the ignore items
 * - call handleMatchingFile each time a file matching a fileSpec is found
 * @param {String} dir
 */
async function loop (dir) {
  // console.log('>' + dir);
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const fullPath = path.resolve(dir, file);
    if (isIgnored(fullPath)) continue;
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      await loop(fullPath); // recurse
    } else if (stat.isFile()) {
      const spec = getFileSpec(fullPath);
      if (spec) await handleMatchingFile(fullPath, spec);
    } else {
      console.log(stat);
      throw new Error();
    }
  }
}

/**
 * Helper to find the corresponding specs for a file
 * @param {String} fullPath
 */
function getFileSpec (fullPath) {
  for (const specKey of filesKeys) {
    if (fullPath.endsWith(specKey)) {
      return files[specKey];
    }
  }
}

/**
 * Return true is this file or directory should be ignored
 * @param {String} fullPath
 */
function isIgnored (fullPath) {
  for (const i of ignore) {
    if (fullPath.indexOf(i) >= 0) return true;
  }
  return false;
}

/**
 * Called for each matched file
 * @param {String} fullPath a file Path
 * @param {Object} spec the Specifications from files matching this file
 */
async function handleMatchingFile (fullPath, spec) {
  let updatedFile = false;
  for (const actionItemKey of Object.keys(spec)) {
    const actionItem = spec[actionItemKey];
    const res = await actionItem.actionMethod(fullPath);
    if (res) {
      updatedFile = true;
      console.log(actionItemKey + ' >>> ' + fullPath);
    }
  }
  if (updatedFile) {
    updated++;
  }
  count++;
}

function exitWithError (message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}
