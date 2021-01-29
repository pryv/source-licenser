## Script to add license header to all files (recursive) in a directory

### Actions:

Actions are specified in fileSpecs configuration object. Each time a file match a specs all actions defined in the specification will be applies. 

#### addHeader

- For each file type a Specifications are defined in fileSpecs array
   - startBlock: The starting line of the license block (used to determine 
     if file already has a lincense)
   - lineBlock: Will replace all line return '\n' of LICENSE file  
   - endBlock: The end of the license block. Used to determine the end 
      of extising license.

- Replaces existing license header if found
  if spec.startBlock is found in the firsts bytes of the files, 
   - read full file content  
   - remove all lines between spec.startBlock and spec.endBlock
   - save bakc the file

- Prepend the License content to all files matching a spec.

Note: speed by could be optimzed, 
 1- do not remove /replace license in files that have a valid license header
 2- when difference is found and license needs to be changed. Directly
   change the license instead of having a intermediary remove - save step

#### 

```
license({
  srcDir: './',
  config: 'licenser.yaml',
  licenseFile: './LICENSE',
})






# License
Copyright (c) 2021 Pryv S.A. https://pryv.com

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
