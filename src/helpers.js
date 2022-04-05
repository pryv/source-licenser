const os = require('os');

module.exports = {
  prepareBlocks
};

function prepareBlocks (spec) {
  const startLines = getLines(spec.startBlock).map(l => l.trimEnd());
  ensureBlankLastLine(startLines);
  const startBlock = join(startLines);

  const endLines = getLines(spec.endBlock).map(l => l.trimEnd());
  ensureBlankLastLine(endLines);
  const endBlock = join(endLines);

  let licenseLines = getLines(spec.licenseText);
  stripLastLineIfBlank(licenseLines);
  licenseLines = licenseLines.map(l => (spec.linePrefix + l).trimEnd());
  ensureBlankLastLine(licenseLines);
  const fullLicenseBlock = startBlock + join(licenseLines) + endBlock;

  return {
    startBlock,
    endBlock,
    fullLicenseBlock
  };
}

function getLines(s) {
  return s.split(/\r\n|\r|\n/);
}

function stripLastLineIfBlank(lines) {
  if (lines[lines.length - 1].trimEnd() === '') {
    lines.pop();
  }
  return lines;
}

function ensureBlankLastLine(lines) {
  if (lines[lines.length - 1].trimEnd() !== '') {
    lines.push('');
  }
  return lines;
}

function join(lines) {
  return lines.join(os.EOL);
}
