/**
 * @license
 * [BSD-3-Clause](https://github.com/pryv/source-licenser/blob/master/LICENSE)
 */

const nconf = require('nconf');
const path = require('path');
const yaml = require('js-yaml');

module.exports = loadConfig;

function loadConfig (configFilePath) {
  nconf.argv().env();

  loadFile('local', configFilePath);

  nconf.required([
    'files',
    'license'
  ]);
  nconf.defaults({
    ignore: [],
    substitutions: {}
  });

  return nconf.get();

  function loadFile (scope, filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js') {
      nconf.use(scope, {
        type: 'literal',
        store: require(filePath)
      });
    } else {
      // i.e. JSON or YAML
      const options = { file: filePath };
      if (ext === '.yml' || ext === '.yaml') {
        options.format = {
          parse: yaml.load,
          stringify: yaml.dump
        };
      }
      nconf.file(scope, options);
    }
  }
}
