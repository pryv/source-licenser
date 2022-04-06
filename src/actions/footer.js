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
 * WARNING: Replaces everything after the license 'startBlock'
 */

const fs = require('fs/promises');
const helpers = require('../helpers');

module.exports = {
  prepare,
  key: 'footer'
};

/**
 * Eventually prepare fileSpecs (can be called multiple times)
 * Add actionMethod function to be called on each matched file
 *
 * @param {Object} spec
 * @param {String} license Rendered license text
 */
async function prepare (spec, license) {
  spec.licenseText = license;
  const compiledSpec = helpers.prepareBlocks(spec);
  spec.actionMethod = async function (filePath) {
    return await checkFileAndClean(filePath, compiledSpec);
  };
}

/**
 * Checks the file’s footer and updates it if needed.
 * @param {string} filePath
 * @param {Object} compiledSpec
 * @returns {boolean} `true` if the file was modified
 */
async function checkFileAndClean (filePath, compiledSpec) {
  const originalContent = await fs.readFile(filePath, 'utf8');
  let contentBefore;
  const startBlockIndex = originalContent.lastIndexOf(compiledSpec.startBlock);
  if (startBlockIndex >= 0) {
    // existing footer
    const originalLicenseBlock = originalContent.substring(startBlockIndex);
    if (originalLicenseBlock === compiledSpec.fullLicenseBlock) {
      // up-to-date: skip
      return false;
    } else {
      // outdated: update
      contentBefore = originalContent.substring(0, startBlockIndex);
    }
  } else {
    // no footer yet
    contentBefore = originalContent;
  }
  await fs.writeFile(filePath, contentBefore + compiledSpec.fullLicenseBlock);
  return true;
}
