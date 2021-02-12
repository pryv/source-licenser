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

# License
Copyright (c) 2020-2021 Pryv S.A https://pryv.com

This file is part of Open-Pryv.io and released under BSD-Clause-3 License

Redistribution and use in source and binary forms, with or without 
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, 
   this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, 
   this list of conditions and the following disclaimer in the documentation 
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE 
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

SPDX-License-Identifier: BSD-3-Clause