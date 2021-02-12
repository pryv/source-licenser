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
 * */
const _ = require('lodash');
//const template = require('lodash.template');
const { getConfig } = require('@pryv/boiler');



async function applyTemplate() {
  const config = await getConfig();
  
  // -- get YEARS values
  const years = config.get('license:year');
  const now = new Date();
  
  if (! years.start || years.start === 'CURRENT_YEAR') years.start = now.getFullYear();
  let YEARS = years.start;
  if (! years.end || years.end === 'CURRENT_YEAR') years.end = now.getFullYear();
  if (years.start !== years.end) {
    YEARS = years.start + '-' + years.end;
  }
  config.set('templating:YEARS', YEARS);


  const templateValues = config.get('templating');

  // -- apply template on LICENSE TEXT
  _.templateSettings.interpolate = /{([A-Z_]+)}/g;
  const license = _.template(config.get('licenseSource'))(templateValues);
  config.set('license:content', license);

  // -- apply template on strings founds in fileSpecs
  function onPath(path) {
    const c = config.get(path);
    if (!c) return;
    if (typeof c === 'string') {
      const newC = _.template(c)(templateValues);
      if (newC !== c) config.set(path, newC);
      return;
    }
    if (typeof c === 'object') {
      if (Array.isArray(c)) {
        // not handled
        return;
      }
      
      for (let key of Object.keys(c)) {
        onPath(path + ':' + key);
      }
    }
  }
  onPath('fileSpecs');
}

module.exports = applyTemplate;
