/**
 * @license
 * [BSD-3-Clause](https://github.com/pryv/source-licenser/blob/master/LICENSE)
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
