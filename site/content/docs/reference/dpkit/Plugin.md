---
editUrl: false
next: false
prev: false
title: "Plugin"
---

Defined in: core/build/plugin.d.ts:2

## Extended by

- [`TablePlugin`](/reference/dpkit/tableplugin/)

## Methods

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

Defined in: core/build/plugin.d.ts:3

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

***

### savePackage()?

> `optional` **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

Defined in: core/build/plugin.d.ts:4

#### Parameters

##### dataPackage

[`Package`](/reference/dpkit/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path?`: `string`; \}\>
