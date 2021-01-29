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
const prepend = require('prepend-file');

/**
 * Check the firts "n" bytes of a file to see if it matches the startBlock
 * If yes clean the file up to the end
 * @param {string} fullPath 
 * @param {Object} spec 
 */
async function checkFileHeaderAndClean(fullPath, spec) {
  const fd = fs.openSync(fullPath, 'r');
  const buffer = Buffer.alloc(spec.startBlockLength);
  fs.readSync(fd, buffer, 0, spec.startBlockLength, 0);
  //console.log(buffer, buffer.toString('utf-8'), spec.startBlockLength);
  fs.closeSync(fd);
  if (!buffer.equals(spec.startBlockBuffer)) return false; // does not match return
  // startBlock found read all file and rewrite without startBlock
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const endBlockPos = fileContent.indexOf(spec.endBlock);
  //onsole.log('Updated >> ' + fullPath);
  fs.writeFileSync(fullPath, fileContent.substr(fileContent.indexOf(spec.endBlock) + spec.endBlock.length));
  return true;
}

/**
 * Perfoem the action on this file with this spec
 */
async function action(fullPath, spec) {
  const cleaned = await checkFileHeaderAndClean(fullPath, spec);
  prepend.sync(fullPath, spec.license);
}

/**
 * Eventually prepare fileSpecs (can be called multiple times)
 * Add actionMethod function to be called on each matched file
 * 
 * @param {Object} fileSpecs 
 * @param {String} license - content of the license
 */
async function prepare(spec, license) {
  spec.startBlockBuffer = Buffer.from(spec.startBlock, 'utf-8'); // save startBlock as Buffer for fast check
  spec.startBlockLength = spec.startBlockBuffer.length;
  let myLicense = '' + license;
  if (spec.lineBlock !== '') {
    myLicense = myLicense.split('\n').join('\n' + spec.lineBlock)
  }
  spec.license = spec.startBlock + myLicense + spec.endBlock; // prepare license block
  spec.actionMethod = async function (fullPath) {
    await action(fullPath, spec);
  };
}

module.exports = {
  prepare: prepare,
  key: 'addHeader'
}