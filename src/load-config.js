/**
 * @license
 * Copyright (c) 2020-2021 Pryv S.A https://pryv.com
 *
 * This file is part of Open-Pryv.io and released under BSD-Clause-3 License
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nconf = require('nconf');

nconf.formats.yaml = {
  stringify: function (obj, options) {
    return yaml.dump(obj, options);
  },
  parse: function (obj, options) {
    return yaml.load(obj, options);
  }
};

// -- read the arguments
if (process.argv.length < 4) {
  exitWithTip('missing arguments');
}

// CONFIG file
const configFile = path.resolve(path.normalize(process.argv[2]));
if (! fs.existsSync(configFile)) {
  exitWithTip(`Config file '${configFile}' not found`);
}

// LICENSE file
const licensePath = path.resolve(path.normalize(process.argv[3]));
if (! fs.existsSync(licensePath)) {
  exitWithTip(`License file '${licensePath}' not found`);
}
try {
  // load license file
  license = '\n' + fs.readFileSync(licensePath, 'utf-8');
} catch (e) {
  exitWithTip(`${e.message} while reading '${licensePath}' LICENSE file`);
}

// SOURCE DIR
const sourcePath = path.resolve(path.normalize(process.argv[4]));
if (! fs.existsSync(sourcePath) || ! fs.lstatSync(sourcePath).isDirectory()) {
  exitWithTip(`'${sourcePath}' not found or not a directory`);
}

// Load config
const store = new nconf.Provider();

// 0. memory at top
store.use('memory');

// get config from arguments and env variables
// memory must come first for config.set() to work without loading config files
// 3. `process.env`
// 4. `process.argv`
store.argv({parseValues: true}).env({parseValues: true, separator: '__'});

loadFile('local', configFile);
store.use('license', {
  type: 'literal',
  store: {
    src: sourcePath,
    licenseSource: license
  }
});

loadFile('default-file', path.resolve(__dirname, '../config/default-config.yml'));

// -- ready

function exitWithTip(tip) {
  console.error(`Error: ${tip}\nUsage: ${path.basename(process.argv[1])} <config.yml> <license-txt-file> <directory>`);
  process.exit(1);
}

function loadFile(scope, filePath) {
  if (fs.existsSync(filePath)) {
    if (filePath.endsWith('.js')) {  // JS file
      const conf = require(filePath);
      store.use(scope, { type: 'literal', store: conf });
    } else {   // JSON or YAML
      const options = { file: filePath }
      if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) { options.format = nconf.formats.yaml }
      store.file(scope, options);
    }

    //console.info('Loaded [' + scope + '] from file: ' + filePath)
  } else {
    console.error(`Cannot find file '${filePath}' for scope '${scope}'`);
  }
}

module.exports = store;
