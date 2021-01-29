/**
 * @license
 * Copyright (c) 2021 Pryv S.A. https://pryv.com
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
 * */

const fs = require('fs');
const _ = require('lodash');
const sortPackageJson = require('sort-package-json');


async function action(fullPath, spec) {
  // load .json file
  let package = require(fullPath);
  if (spec.force) {
    package = _.merge(package, spec.force);
  }
  if (spec.defaults) {
    package = _.mergeWith(package, spec.defaults, function (src, dest) {
      if (typeof src === 'undefined') return dest;
      return src;
    });
  }
  if (spec.sortPackage) {
    package = sortPackageJson(package);
  }
  fs.writeFileSync(fullPath, JSON.stringify(package, null, 2));
}

/**
 * Eventually prepare fileSpecs (can be called multiple times)
 * @param {Object} actionItem 
 * @param {String} license - content of the license
 * @return {Function} the action to apply;
 */
async function prepare(actionItem, license) {
  actionItem.actionMethod = async function (fullPath) {
    console.log('JSON Handler >> ' + fullPath);
    await action(fullPath, actionItem);
  };
}


module.exports = {
  prepare: prepare,
  key: 'json'
}