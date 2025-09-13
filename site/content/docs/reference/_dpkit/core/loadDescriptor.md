---
editUrl: false
next: false
prev: false
title: "loadDescriptor"
---

> **loadDescriptor**(`path`, `options?`): `Promise`\<\{ `basepath`: `string`; `descriptor`: `Record`\<`string`, `any`\>; \}\>

Defined in: [core/general/descriptor/load.ts:10](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/general/descriptor/load.ts#L10)

Load a descriptor (JSON Object) from a file or URL
Uses dynamic imports to work in both Node.js and browser environments
Supports HTTP, HTTPS, FTP, and FTPS protocols

## Parameters

### path

`string`

### options?

#### onlyRemote?

`boolean`

## Returns

`Promise`\<\{ `basepath`: `string`; `descriptor`: `Record`\<`string`, `any`\>; \}\>
