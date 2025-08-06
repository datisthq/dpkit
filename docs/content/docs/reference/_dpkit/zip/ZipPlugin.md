---
editUrl: false
next: false
prev: false
title: "ZipPlugin"
---

Defined in: [plugin.ts:4](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/zip/plugin.ts#L4)

## Implements

- [`Plugin`](/reference/dpkit/plugin/)

## Constructors

### Constructor

> **new ZipPlugin**(): `ZipPlugin`

#### Returns

`ZipPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

Defined in: [plugin.ts:5](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/zip/plugin.ts#L5)

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

#### Implementation of

[`Plugin`](/reference/dpkit/plugin/).[`loadPackage`](/reference/dpkit/plugin/#loadpackage)

***

### savePackage()

> **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

Defined in: [plugin.ts:13](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/zip/plugin.ts#L13)

#### Parameters

##### dataPackage

[`Package`](/reference/dpkit/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

#### Implementation of

[`Plugin`](/reference/dpkit/plugin/).[`savePackage`](/reference/dpkit/plugin/#savepackage)
