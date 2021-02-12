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

// -- read the arguments
if (process.argv.length < 4) {
  exitWithTip('missing arguments');
}

// CONFIG file
const configFile = path.resolve(path.normalize(process.argv[2]));
if (! fs.existsSync(configFile)) {
  exitWithTip('[' + configFile + '] is not an existing file');
}

// LICENSE file
const licensePath = path.resolve(path.normalize(process.argv[3]));
if (! fs.existsSync(licensePath)) {
  exitWithTip('[' + licensePath + '] is not an existing file');
}
try {
  // load license file 
  license = '\n' + fs.readFileSync(licensePath, 'utf-8');
} catch (e) {
  exitWithTip(e.message + ' while reading [' + licensePath + '] LICENSE file');
}

// SOURCE DIR
const sourcePath = path.resolve(path.normalize(process.argv[4]));
if (! fs.existsSync(sourcePath) || ! fs.lstatSync(sourcePath).isDirectory()) {
  exitWithTip('[' + sourcePath + '] is not existing or not a directory ');
}


require('@pryv/boiler').init(
  {
    appName: 'licenser',
    baseConfigDir: path.resolve(__dirname, '../config'),
    extraConfigs: [{
      scope: 'local',
      file: configFile,
    }, {
      scope: 'data',
      data: {
        src: sourcePath,
        licenseSource: license
      }
    }]
  }
);


// -- ready

function exitWithTip(tip) {
  console.error('Error: ' + tip +
    '\nUsage: ' + path.basename(process.argv[1]) + ' <config.yml> <license-txt-file> <directory>');
  process.exit(1);
}
