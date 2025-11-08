---
editUrl: false
next: false
prev: false
title: "DatasetPlugin"
---

Defined in: dataset/build/plugin.d.ts:6

## Extended by

- [`TablePlugin`](/reference/tableplugin/)

## Methods

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/package/)\>

Defined in: dataset/build/plugin.d.ts:7

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/package/)\>

***

### savePackage()?

> `optional` **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

Defined in: dataset/build/plugin.d.ts:8

#### Parameters

##### dataPackage

[`Package`](/reference/package/)

##### options

[`SavePackageOptions`](/reference/savepackageoptions/)

#### Returns

`Promise`\<`undefined` \| \{ `path?`: `string`; \}\>
