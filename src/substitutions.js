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
const _ = require('lodash');

_.templateSettings.interpolate = /{([A-Z_]+)}/g;

module.exports = {
  init (config) {
    this.data = initData(config);
  },
  apply (template) {
    if (typeof template === 'string') {
      return _.template(template)(this.data);
    }
    if (typeof template === 'object') {
      const obj = _.cloneDeep(template);
      for (const k of Object.keys(obj)) {
        applyToStringValues(obj, k, this.data);
      }
      return obj;
    }
  }
};

function initData (config) {
  // copy user-defined properties
  const data = _.cloneDeep(config);

  // then setup built-in helpers if not overridden

  if (!data.CURRENT_YEAR) {
    data.CURRENT_YEAR = new Date().getFullYear();
  }

  if (typeof config.YEARS === 'object') {
    // if missing or literal value: leave as-is
    const y = config.YEARS;
    if (!y.start || !y.end) {
      throw new Error(`Cannot parse substitution 'YEARS': expected 'start' and 'end' properties, got ${JSON.stringify(y)}`);
    }
    if (y.end === 'CURRENT_YEAR' || y.end === '{CURRENT_YEAR}') {
      y.end = new Date().getFullYear();
    }
    data.YEARS = (y.start.toString() !== y.end.toString()) ? `${y.start}–${y.end}` : y.start;
  }

  return data;
}

function applyToStringValues (obj, key, data) {
  const val = obj[key];
  if (!val) {
    return;
  }
  if (typeof val === 'string') {
    obj[key] = _.template(val)(data);
    return;
  }
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      // not handled
      return;
    }
    for (const k of Object.keys(val)) {
      applyToStringValues(val, k, data);
    }
  }
}
