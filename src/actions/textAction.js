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
const os = require('os');

const action = require('./action');

module.exports = Object.assign(Object.create(action), {
  init (id, actionSettings, defaultLicense) {
    action.init.call(this, id, defaultLicense);
    if (!actionSettings ||
        typeof actionSettings.startBlock !== 'string' ||
        typeof actionSettings.endBlock !== 'string') {
      this.throwValidationError('startBlock', 'endBlock');
    }
    this.linePrefix = actionSettings.linePrefix ?? '';
    this.license = actionSettings.license;

    const startLines = getLines(actionSettings.startBlock).map(l => l.trimEnd());
    ensureBlankLastLine(startLines);
    this.startBlock = join(startLines);

    const endLines = getLines(actionSettings.endBlock).map(l => l.trimEnd());
    ensureBlankLastLine(endLines);
    this.endBlock = join(endLines);

    let licenseLines = getLines(this.getLicense());
    stripLastLineIfBlank(licenseLines);
    licenseLines = licenseLines.map(l => (actionSettings.linePrefix + l).trimEnd());
    ensureBlankLastLine(licenseLines);
    this.fullLicenseBlock = this.startBlock + join(licenseLines) + this.endBlock;
  },
  async apply (filePath) {
    throw new Error('Not implemented');
  }
});

function getLines (s) {
  return s.split(/\r\n|\r|\n/);
}

function stripLastLineIfBlank (lines) {
  if (lines[lines.length - 1].trimEnd() === '') {
    lines.pop();
  }
  return lines;
}

function ensureBlankLastLine (lines) {
  if (lines[lines.length - 1].trimEnd() !== '') {
    lines.push('');
  }
  return lines;
}

function join (lines) {
  return lines.join(os.EOL);
}
