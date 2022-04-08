# Source Licenser

Add license information to source files. Checks target files, looks for existing license content and replaces it if needed. Supports header, footer, json and sibling license file content, with variable substitution and a couple of other useful features.

1. Define search patterns for the target files in your configuration, e.g. `**/*.js`
2. Define the action(s) to be taken for each pattern, such as adding/updating header comments in source files, a footer section in a doc, properties in a JSON file or a `LICENSE` file
3. Put in your license text (default or custom per action)
4. Use variable substitutions to keep it DRY


## Usage

### Install

`npm install [-g] source-licenser`

### Setup

Define a configuration file as per your needs (see below). You can also use the licenser's [own config file](./config/licenser-config.yml) as inspiration.

### Run

`source-licenser --config-file <config.yml> <directory> `

Example: `source-licenser --config-file ./config/licenser-config.yml ./`

### Configuration file

### `files`

Define search patterns for your target files in the `files` configuration object (see also `ignore` below). Usual glob patterns such as `**/*.js` are supported. For each pattern, define the action(s) to be taken:

```yaml
files:
  <pattern>:
    <action>:
      <setting>: <value>
  ...
```

#### `header` and `footer`

Respectively prepend or append license content to files. Settings:

- `startBlock` (string): The starting line(s) of the license block, used to determine if a header already exists. E.g. `/**\n * @license`
- `linePrefix` (string, optional): A prefix for each line of the `license` text. E.g. ` * `
- `endBlock` (string): The ending line(s) of the license block, used to determine where the existing header ends.
- `license` (string, optional): Action-specific license text. Defaults to the root `license` setting (see below).

#### `siblingLicenseFile`

Add a license file at the same level as the matching file(s). Settings:

- `name` (string): The name of the license file. E.g. `LICENSE`
- `license` (string, optional): Action-specific license text. Defaults to the root `license` setting (see below).

#### `json`

Add/update JSON properties (mainly aimed at `package.json`). Settings:

- `force` (key-value, optional): Properties to always set regardless of whether a value already exists
- `defaults` (key-value, optional): Properties to set if not defined
- `sortPackage` (`true`|`false`, optional): Ensure a consistent ordering of `package.json` properties

### `ignore` (optional)

List file patterns to be ignored

### `license`

The license text. Can be overridden in action settings.

### `substitutions` (optional)

Define variables that can be used in `license` or action settings with the format `{NAME}`. The following helper variables are built in (but can be overridden):

- `CURRENT_YEAR` will evaluate to… 🥁… the current year
- `YEARS` will evaluate to `end` if `start` == `end`, and to `start–end` otherwise


## License

[BSD-3-Clause](LICENSE)
