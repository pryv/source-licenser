/**
 * @license
 * [BSD-3-Clause](https://github.com/pryv/source-licenser/blob/master/LICENSE)
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
