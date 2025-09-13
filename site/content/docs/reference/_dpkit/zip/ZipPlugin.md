---
editUrl: false
next: false
prev: false
title: "ZipPlugin"
---

Defined in: [plugin.ts:4](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zip/plugin.ts#L4)

## Implements

- [`Plugin`](/reference/_dpkit/core/plugin/)

## Constructors

### Constructor

> **new ZipPlugin**(): `ZipPlugin`

#### Returns

`ZipPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

Defined in: [plugin.ts:5](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zip/plugin.ts#L5)

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

#### Implementation of

[`Plugin`](/reference/_dpkit/core/plugin/).[`loadPackage`](/reference/_dpkit/core/plugin/#loadpackage)

***

### savePackage()

> **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

Defined in: [plugin.ts:13](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zip/plugin.ts#L13)

#### Parameters

##### dataPackage

[`Package`](/reference/_dpkit/core/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

#### Implementation of

[`Plugin`](/reference/_dpkit/core/plugin/).[`savePackage`](/reference/_dpkit/core/plugin/#savepackage)
