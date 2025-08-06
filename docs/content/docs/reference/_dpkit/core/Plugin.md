---
editUrl: false
next: false
prev: false
title: "Plugin"
---

Defined in: [core/plugin.ts:3](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/plugin.ts#L3)

## Methods

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

Defined in: [core/plugin.ts:4](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/plugin.ts#L4)

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

***

### savePackage()?

> `optional` **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

Defined in: [core/plugin.ts:6](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/plugin.ts#L6)

#### Parameters

##### dataPackage

[`Package`](/reference/_dpkit/core/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path?`: `string`; \}\>
