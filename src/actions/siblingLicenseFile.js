const path = require('path');
const fs = require('fs/promises');

const action = require('./action');

module.exports = Object.assign(Object.create(action), {
  init (actionSettings, defaultLicense) {
    action.init.call(this, 'siblingLicenseFile', defaultLicense);
    this.settings = actionSettings;
  },

  /**
   * Checks whether there's a LICENSE file in the same directory and updates it if needed.
   * @param {string} filePath
   * @returns {boolean} `true` if the file was modified
   */
  async apply (filePath) {
    const licensePath = path.resolve(path.dirname(filePath), 'LICENSE');
    try {
      const actualContent = await fs.readFile(licensePath, 'utf-8');
      if (actualContent === this.getLicense()) {
        // up-to-date: skip
        return false;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
      // file does not exist
    }
    await fs.writeFile(licensePath, this.getLicense());
    return true;
  }
});
