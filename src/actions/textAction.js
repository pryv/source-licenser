const os = require('os');

const action = require('./action');

module.exports = Object.assign(Object.create(action), {
  init (id, actionSettings, defaultLicense) {
    action.init.call(this, id, defaultLicense);

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
