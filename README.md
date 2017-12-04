# file-hierarchy - Turn an entire directory tree into a js-hierarchy node

## Introduction

File-Hierarchy provides a JS-Hierarchy Node implementation, that turns a directory tree into a JS-Hierarchy tree using
the `scan`-method.

Every directory entry is processed and its statistics data is gathered and saved. You can traverse the tree using
JS-Hierarchy's standard `walk` feature.

Unlinke JS-Hierarchy, this module is not available for the browser (like, duh!).

## Installation

Install the module using

    npm install file-hierarchy --save

If you're using Typescript, you might want to add the following typings:

    npm install @types/bluebird @types/loglevel @types/node --save-dev

## Usage

Typescript:

```typescript
import { FileNode, ScanOptions } from '../lib/FileNode'

new FileNode().scan(new ScanOptions('/my/path'))
  .then(
    fileNode => {
      console.log(fileNode.path)
    }
  )
```

Javascript:

```javascript
const fileHierarchy = require('file-hierarchy')

new fileHierarchy.FileNode().scan(new fileHierarchy.ScanOptions('/my/path'))
  .then(
    fileNode => {
      console.log(fileNode.path)
    }
  )
```

See the [API-docs](docs) for details.

## Building

To test and build this package, simply use grunt:

    grunt test