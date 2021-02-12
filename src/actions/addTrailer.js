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

/**
 * Add license at the END of the file
 * 
 * WARNING Does not have a "endBlock" search so everything after the license "startBlock" will be removed! 
 */

const fs = require('fs');

/**
 * Check if file already has this as a trailer
 * @param {string} fullPath 
 * @param {Object} spec 
 */
async function checkFileAndClean(fullPath, spec) {
  let fileContent = fs.readFileSync(fullPath, 'utf8');
  const endBlockPos = fileContent.lastIndexOf(spec.startBlock);
  if (endBlockPos > 1) {
    //const toBeRemoved = fileContent.substr(fileContent.indexOf(spec.startBlock) + spec.startBlock.length)
    //console.log('toBeRemoved >> ' + fullPath, toBeRemoved);
    fileContent = fileContent.substr(0, fileContent.indexOf(spec.startBlock));
  }
  fs.writeFileSync(fullPath, fileContent + spec.license);
  return true;
}


/**
 * Eventually prepare fileSpecs (can be called multiple times)
 * Add actionMethod function to be called on each matched file
 * 
 * @param {Object} fileSpecs 
 * @param {String} license - content of the license
 */
async function prepare(spec, license) {
  spec.license = '\n' + spec.startBlock + license.split('\n').join('\n' + spec.lineBlock) + spec.endBlock; // prepare license block
  spec.actionMethod = async function (fullPath) {
    await checkFileAndClean(fullPath, spec);
  };
}

module.exports = {
  prepare: prepare,
  key: 'addTrailer'
}