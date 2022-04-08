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

const textAction = require('./textAction');

module.exports = Object.assign(Object.create(textAction), {
  init (actionSettings, defaultLicense) {
    textAction.init.call(this, 'header', actionSettings, defaultLicense);
  },

  /**
   * Checks the file’s header and updates it if needed.
   * @param {string} filePath
   * @returns {boolean} `true` if the file was modified
   */
  async apply (filePath) {
    const originalContent = await fs.readFile(filePath, 'utf8');
    let contentBefore;
    let contentAfter;
    const startBlockIndex = originalContent.indexOf(this.startBlock);
    const endBlockIndex = originalContent.indexOf(this.endBlock, startBlockIndex + this.startBlock.length);
    if (startBlockIndex >= 0) {
      // existing header
      const originalLicenseBlock = originalContent.substring(startBlockIndex, endBlockIndex + this.endBlock.length);
      if (originalLicenseBlock === this.fullLicenseBlock) {
        // up-to-date: skip
        return false;
      } else {
        // outdated: update
        contentBefore = originalContent.substring(0, startBlockIndex);
        contentAfter = originalContent.substring(endBlockIndex + this.endBlock.length);
      }
    } else {
      // no header yet
      contentBefore = '';
      contentAfter = originalContent;
    }
    await fs.writeFile(filePath, contentBefore + this.fullLicenseBlock + contentAfter);
    return true;
  }
});
