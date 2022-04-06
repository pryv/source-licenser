# Source Licenser

Add license information to source files:

- Recursively checks all files in a directory
- Detects existing license content and replaces it if needed
- Can be extended for other file types

How it works:

- Actions are defined per fileTypes ex: `.js` , `README.md`, `package.json`.
- Actions can be:
  - `header`:  Add license text at the beginning of the file. Comment characters can be defined.

    ​	Example: for `.js` file add

    ```javascript
    /**
     * license content
     */
    ```

  - `footer`: Add license text at the end of the file. Comment characters can be defined.
  - `json`: Add or complete fields of json files. (Ex: package.json)
  - `siblingLicenseFile`: Add a `LICENSE` text file at the same level as the matching file.


## Usage

### Install

`npm install source-licenser [-g]`

### Setup

Define a configuration file as per your needs (see below). You can also use `config/licenser-config.yml` as inspiration.

### Run

`source-licenser --config-file <config.yml> <directory> `

Example: `source-licenser --config-file ./config/licenser-config.yml ./`

### Configuration file

### `fileSpecs`

Actions are specified in the `fileSpecs` configuration object. Each time a file matches a specification, all actions defined therein will be applied.

#### `header`

Prepend the license content to all files matching a spec. Settings:

- `startBlock`: The starting line of the license block (used to determine if a file already has a license)
- `linePrefix`: Will replace all lines return '\n' of LICENSE file
- `endBlock`: The end of the license block. Used to determine the end of the existing license.

#### `footer`

Append the license content to all files matching a spec. Settings:

- `startBlock`: The starting line of the license block (used to determine if a file already has a license)
- `linePrefix`: Will replace all lines return '\n' of LICENSE file
- `endBlock`: The end of the license block.

#### `siblingLicenseFile`

Add a "LICENSE" file at the same level as the matching file.

#### `json`

Update a JSON field (mainly used for `package.json`). Settings:

- `force`: Override fields by the specified values
- `defaults`: Update fields if not defined
- `sortPackage`: `true` or `false`. Order the fields as per `package.json`

### `ignore`

List file patterns to be ignored.

### `license`

The license text.

### `substitutions`

Define values that can be used in `license` or `json` properties with the format `{NAME}`.


## License

[BSD-3-Clause](LICENSE)
