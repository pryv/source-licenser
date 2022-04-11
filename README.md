# Source Licenser

[![CI](https://github.com/pryv/source-licenser/actions/workflows/ci.yml/badge.svg)](https://github.com/pryv/source-licenser/actions/workflows/ci.yml) ![npm](https://img.shields.io/npm/v/source-licenser)

Add license information to source files. Checks target files, looks for existing license content and replaces it if needed. Supports header, footer, json and sibling license file content, with variable substitution and a couple of other useful features.


## Usage

### Install

`npm install [-g] source-licenser`

### Setup

Define a configuration file as per your needs (see below). You can use the licenser's [own config file](./config/licenser-config.yml) as a starting point.

### Run

`source-licenser --config-file <config.yml> <directory> `

Example: `source-licenser --config-file ./config/licenser-config.yml ./`

### Configuration file

YAML (used below), JSON and JS are supported.

```yaml
files:
  <pattern>: # e.g. "**/*.js"
    <action>: # header, footer, siblingLicenseFile or json
      <setting>: <value> # see details of actions below
      ...
    ...
  ...

ignore:
- <pattern> # e.g. git, node_modules
- ...

license: |
  <text>
  ...

substitutions:
  <key>: <value>
  ...
```

### `files`

Define search patterns for your target files in the `files` configuration object (see also `ignore` below). Usual glob patterns such as `**/*.js` are supported. For each pattern, define the action(s) to be taken:

#### `header` and `footer` actions

Respectively prepend or append license content to files. Settings:

- `startBlock` (string): The starting line(s) of the license block, used to determine if a header already exists. E.g. `/**\n * @license`
- `linePrefix` (string, optional): A prefix for each line of the `license` text. E.g. ` * `
- `endBlock` (string): The ending line(s) of the license block, used to determine where the existing header ends.
- `license` (string, optional): Action-specific license text. Defaults to the root `license` setting (see below).

#### `siblingLicenseFile` action

Add a license file at the same level as the matching file(s). Settings:

- `name` (string): The name of the license file. E.g. `LICENSE`
- `license` (string, optional): Action-specific license text. Defaults to the root `license` setting (see below).

#### `json` action

Add/update JSON properties (mainly aimed at `package.json`). Settings:

- `force` (key-value, optional): Properties to always set regardless of whether a value already exists
- `defaults` (key-value, optional): Properties to set if not defined
- `sortPackage` (`true`|`false`, optional): Ensure a consistent ordering of `package.json` properties

### `ignore` (optional)

List file patterns to be ignored.

### `license`

The license text. Can be overridden in action settings.

### `substitutions` (optional)

Define variables that can be used in `license` or action settings with the format `{NAME}`. The following helper variables are built in (but can be overridden):

- `CURRENT_YEAR` simply evaluates to the current (full) year, e.g. `2022`
- `YEARS`, when configured with `start` and `end` values, evaluates to `end` if `start` == `end`, and to `start–end` otherwise. `end` accepts the value `CURRENT_YEAR`. For example:
  ```
  substitutions:
    YEARS:
      start: 2020
      end: CURRENT_YEAR
  ```


## Contributing

`npm test` runs the [tests](./test) with [Mocha](https://mochajs.org/).

`npm run test-cover` runs the tests and outputs coverage stats with [Istanbul](https://istanbul.js.org/).

`npm run license-me` runs source-licenser on itself.

The code follows the [Semi-Standard](https://github.com/standard/semistandard) style.


## License

[BSD-3-Clause](LICENSE)
