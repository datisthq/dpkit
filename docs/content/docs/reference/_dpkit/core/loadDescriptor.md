---
editUrl: false
next: false
prev: false
title: "loadDescriptor"
---

> **loadDescriptor**(`path`, `options?`): `Promise`\<\{ `basepath`: `string`; `descriptor`: `Record`\<`string`, `any`\>; \}\>

Defined in: [core/general/descriptor/load.ts:10](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/general/descriptor/load.ts#L10)

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
