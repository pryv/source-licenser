const nixt = require('nixt');
const util = require('util');
const fse = require('fs-extra');
const path = require('path');
const tmp = require('tmp-promise');
const assert = require('assert');
const exp = require('constants');

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

      checkResult('footer-none.md');
      checkResult('footer-existing.md');
    });

    after(async () => {
      sourceDir.cleanup();
    });

    function checkResult(sourceFileName, description) {
      const actual = fileContents(path.join(sourceDir.path, sourceFileName));
      const expected = fileContents(path.join(fixture('expected-results'), sourceFileName));
      // DEBUG, TODO: remove
      console.log("\nACTUAL:\n=======\n" + actual);
      console.log("\nEXPECTED:\n=========\n" + expected);
      assert.equal(actual, expected);
    }

    /**
     * @returns The full (temp copy) source file name.
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
 * @returns The full (original) fixture filename.
 */
function fixture (name) {
  return path.join(__dirname, '../test/fixtures', name);
}

/**
 * @returns The file’s contents.
 */
function fileContents (path) {
  return fse.readFileSync(path, 'utf8');
}
