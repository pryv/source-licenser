/**
 * @license
 * Copyright (c) 2020–2022 Pryv S.A https://pryv.com
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
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
const fs = require('fs/promises');
const _ = require('lodash');
const sortPackageJson = require('sort-package-json');

const action = require('./action');

module.exports = Object.assign(Object.create(action), {
  init (actionSettings, defaultLicense) {
    action.init.call(this, 'json', defaultLicense);
    this.settings = actionSettings;
  },

  /**
   * Checks the JSON file’s properties and updates it if needed.
   * @param {string} filePath
   * @returns {boolean} `true` if the file was modified
   */
  async apply (filePath) {
    let jsonData = JSON.parse(await fs.readFile(filePath));
    const originalContent = JSON.stringify(jsonData, null, 2);
    if (this.settings.force) {
      jsonData = _.merge(jsonData, this.settings.force);
    }
    if (this.settings.defaults) {
      jsonData = _.mergeWith(jsonData, this.settings.defaults, function (existingVal, defaultVal) {
        return (typeof existingVal === 'undefined') ? defaultVal : existingVal;
      });
    }
    if (this.settings.sortPackage) {
      jsonData = sortPackageJson(jsonData);
    }
    const newContent = JSON.stringify(jsonData, null, 2);
    if (originalContent === newContent) {
      // up-to-date: skip
      return false;
    }
    await fs.writeFile(filePath, newContent);
    return true;
  }
});
