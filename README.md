# Source Licenser

Add license information to source files. 

- Detect existing license content and replace it if needed.
- Can be extended for other file types. 

How it works

- Actions are defined per fileTypes ex: `.js` , `REAMDE.md`, `package.json`. 

- As per `v1.0.0` Actions can be: 

  - `addHeader` :  Add license text at the beginning of the file. Comment characters can be defined.

    ​	Exemple: for `.js` file add

    ```javascript
    /**
     * license content
     */
    ```

  - `addTrailer`: Add license text at the end of the file. Comment characters can be defined.

  - `addSibling`: Add a `LICENSE` text file at the same level as the matching file.

  - `json`: Add or Complete fields of json files. (Ex: package.json)

### Installation

`npm install source-licenser -g`

### Setup

1. Get a source license file `<license-txt-file>` exemple: `config/LICENSE.src`
2. Copy `config/license-config.yml` and edit as per your needs.
3. Eventually complete and edit `config/production-config.yml` 

### Usage

`source-licenser <config.yml> <license-txt-file> <directory> `

Exemple:

`source-licenser ./config/licenser-config.yml ./config/LICENSE.src ./` 

## Contribute

### Actions:

Actions are specified in fileSpecs configuration object. Each time a file matches a spec all actions defined in the specification will be applied. 

#### addHeader

Prepend the License content to all files matching a spec.

- Settings
   - **startBlock**: The starting line of the license block (used to determine 
     if a file already has a license)
   - **lineBlock**: Will replace all lines return '\n' of LICENSE file  
   - **endBlock**: The end of the license block. Used to determine the end 
      of existing license.

#### addTrailer

Append the License content to all files matching a spec.

- Settings
  - **startBlock**: The starting line of the license block (used to determine 
    if a file already has a license)
  - **lineBlock**: Will replace all lines return '\n' of LICENSE file  
  - **endBlock**: The end of the license block.

#### addSibling

Add a "LICENSE" file at the same level as the matching file

#### Json

Update a '.json' field. (mainly used for package.json)

- Settings
  - **force**: Override fields by the specified values
  - **defaults**: Update fields if not defined
  - **sortPackage**: true / false. Order the fields as par `package.json` 

### Notes:

Optimizations to do:
 1- do not remove /replace license in files that have a valid license header
 2- when difference is found and license needs to be changed. Directly
   change the license instead of having an intermediary remove - save step.