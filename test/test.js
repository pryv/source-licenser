const nixt = require('nixt');
const util = require('util');
const fse = require('fs-extra');
const path = require('path');
const tmp = require('tmp-promise');
const assert = require('assert');

const bin = './bin/source-licenser';

describe('source-licenser', async () => {
  describe('when run with a valid config file and target source directory', async () => {
    let sourceDir;

    before(async () => {
      sourceDir = await tmp.dir();
      fse.copy(fixture('source'), sourceDir.path);
    });

    it('should add license info as configured', async () => {
      await cli()
        .run(`${bin} ${fixture('config/test-config.yml')} ${fixture('config/LICENSE.src')} ${sourceDir.path}`)
        .stderr('')
        .code(0)
        .go();


    });

    after(async () => {
      sourceDir.cleanup();
    });

    /**
     * Returns the full (temp copy) source file name.
     * To be used in tests only.
     */
    function sourceFile (name) {
      return path.join(sourceDir.path, name);
    }
  });

  describe('when run with no argument', async () => {
    it('should fail and display usage instructions', async () => {
      await cli()
        .run(`${bin}`)
        .code(1)
        .stderr(/Usage: .+/)
        .go();
    });
  });
});

/**
 * nixt wrapper: cwd() is setup and go() returns a promisified end().
 */
 function cli () {
  const n = nixt();
  n.go = util.promisify(n.end);
  return n.cwd(path.join(__dirname, '/..'));
}

/**
 * Returns the full (original) fixture filename.
 */
 function fixture (name) {
  return path.join(__dirname, '../test/fixtures', name);
}
