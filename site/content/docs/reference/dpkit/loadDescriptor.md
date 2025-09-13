---
editUrl: false
next: false
prev: false
title: "loadDescriptor"
---

> **loadDescriptor**(`path`, `options?`): `Promise`\<\{ `basepath`: `string`; `descriptor`: `Record`\<`string`, `any`\>; \}\>

Defined in: core/build/general/descriptor/load.d.ts:6

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
