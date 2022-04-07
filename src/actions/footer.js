const fs = require('fs/promises');

const textAction = require('./textAction');

module.exports = Object.assign(Object.create(textAction), {
  init (actionSettings, defaultLicense) {
    textAction.init.call(this, 'footer', actionSettings, defaultLicense);
  },

  /**
   * Checks the file’s footer and updates it if needed.
   * @param {string} filePath
   * @returns {boolean} `true` if the file was modified
   */
  async apply (filePath) {
    const originalContent = await fs.readFile(filePath, 'utf8');
    let contentBefore;
    const startBlockIndex = originalContent.lastIndexOf(this.startBlock);
    if (startBlockIndex >= 0) {
      // existing footer
      const originalLicenseBlock = originalContent.substring(startBlockIndex);
      if (originalLicenseBlock === this.fullLicenseBlock) {
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
    await fs.writeFile(filePath, contentBefore + this.fullLicenseBlock);
    return true;
  }
});
