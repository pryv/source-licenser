# Source Licenser

Add license information to source files:

- Recursively checks all files in a directory
- Detects existing license content and replaces it if needed
- Can be extended for other file types

How it works:

- Actions are defined per fileTypes ex: `.js` , `README.md`, `package.json`.
- As per v1.0, actions can be:
  - `addHeader`:  Add license text at the beginning of the file. Comment characters can be defined.

    ​	Example: for `.js` file add

    ```javascript
    /**
     * license content
     */
    ```

  - `addTrailer`: Add license text at the end of the file. Comment characters can be defined.
  - `addSibling`: Add a `LICENSE` text file at the same level as the matching file.
  - `json`: Add or complete fields of json files. (Ex: package.json)


## Usage

### Install

`npm install source-licenser -g`

### Setup

1. Get a source license file `<license-txt-file>`, for example: `config/LICENSE.src`
2. Copy `config/license-config.yml` and edit as per your needs (check `default-config` for inspiration)

### Run

`source-licenser <config.yml> <license-txt-file> <directory> `

Example: `source-licenser ./config/licenser-config.yml ./config/LICENSE.src ./`

### Configuration file

### Actions

Actions are specified in the `fileSpecs` configuration object. Each time a file matches a specification, all actions defined therein will be applied.

#### `addHeader`

Prepend the license content to all files matching a spec. Settings:

- `startBlock`: The starting line of the license block (used to determine if a file already has a license)
- `lineBlock`: Will replace all lines return '\n' of LICENSE file
- `endBlock`: The end of the license block. Used to determine the end of the existing license.

#### `addTrailer`

Append the license content to all files matching a spec. Settings:

- `startBlock`: The starting line of the license block (used to determine if a file already has a license)
- `lineBlock`: Will replace all lines return '\n' of LICENSE file
- `endBlock`: The end of the license block.

#### `addSibling`

Add a "LICENSE" file at the same level as the matching file

#### `json`

Update a JSON field (mainly used for `package.json`). Settings:

- `force`: Override fields by the specified values
- `defaults`: Update fields if not defined
- `sortPackage`: `true` or `false`. Order the fields as per `package.json`


## License

[BSD-3-Clause](LICENSE)
