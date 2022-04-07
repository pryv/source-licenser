const nixt = require('nixt');
const util = require('util');
const fse = require('fs-extra');
const path = require('path');
const tmp = require('tmp-promise');
const assert = require('assert');

const bin = './bin/source-licenser';

/* global describe, before, after, it */

describe('source-licenser', async () => {
  describe('when run with a valid config file and target directory', async () => {
    let sourceDir;

    before(async () => {
      sourceDir = await tmp.dir();
      fse.copy(fixture('source'), sourceDir.path);

      await cli()
        .run(`${bin} --config-file ${fixture('config/test-config.yml')} ${sourceDir.path}`)
        .stderr('')
        .code(0)
        .go();
    });

    after(async () => {
      sourceDir.cleanup();
    });

    describe('"header"', () => {
      it('should add a header if missing', () => {
        checkResultFile('header-none.js');
      });

      it('should leave files untouched if up-to-date', () => {
        checkResultFile('header-existing.js');
      });
    });

    describe('"footer"', () => {
      it('should add a footer if missing', () => {
        checkResultFile('footer-none.md');
      });

      it('should leave files untouched if up-to-date', () => {
        checkResultFile('footer-existing.md');
      });
    });

    describe('"json"', () => {
      // TODO: consider splitting into details
      it('should set JSON properties as configured', () => {
        checkResultFile('package.json');
      });
    });

    describe('"siblingLicenseFile"', () => {
      it('should add a license file as configured if missing', () => {
        checkResultFile('LICENSE');
      });

      it('should leave an existing license file untouched if up-to-date', () => {
        checkResultFile('LICENSE-EXISTING');
      });
    });

    describe('"ignore"', () => {
      it('should leave specified files untouched even if they match patterns in "files"', () => {
        checkResultFile('ignore-me/some-module.js');
      });
    });

    describe('helper substitutions', () => {
      it('"CURRENT_YEAR" should evaluate to the current year', () => {
        checkResultJSON('helper-substitutions.json', 'currentYear', new Date().getFullYear());
      });

      it('"YEARS" should evaluate to the configured "start–end" years', () => {
        checkResultJSON('helper-substitutions.json', 'years', `2020–${new Date().getFullYear()}`);
      });
    });

    function checkResultFile (sourceFileName) {
      const expected = fileContents(path.join(fixture('expected-results'), sourceFileName));
      const actual = fileContents(path.join(sourceDir.path, sourceFileName));
      assert.equal(actual, expected);
    }

    function checkResultJSON (sourceFileName, key, expectedValue) {
      const json = JSON.parse(fse.readFileSync(path.join(sourceDir.path, sourceFileName)));
      assert.equal(json[key], expectedValue);
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
