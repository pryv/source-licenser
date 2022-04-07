const path = require('path');
const fs = require('fs/promises');

const action = require('./action');
const actionId = 'siblingLicenseFile';

module.exports = Object.assign(Object.create(action), {
  init (actionSettings, defaultLicense) {
    action.init.call(this, actionId, defaultLicense);
    if (!actionSettings || typeof actionSettings.name !== 'string') {
      this.throwValidationError('name');
    }
    this.licenseFileName = actionSettings.name;
    this.license = actionSettings.license;
  },

  /**
   * Checks whether there's a license file in the same directory and updates it if needed.
   * @param {string} filePath
   * @returns {boolean} `true` if the file was modified
   */
  async apply (filePath) {
    const licensePath = path.resolve(path.dirname(filePath), this.licenseFileName);
    try {
      const originalContent = await fs.readFile(licensePath, 'utf-8');
      if (originalContent === this.getLicense()) {
        // up-to-date: skip
        return false;
      }
    } catch (e) {
      if (e.code !== 'ENOENT') {
        // unexpected error
        throw e;
      }
      // file does not exist ⇒ create it
    }
    await fs.writeFile(licensePath, this.getLicense());
    return true;
  }
});
