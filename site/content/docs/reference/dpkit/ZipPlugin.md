---
editUrl: false
next: false
prev: false
title: "ZipPlugin"
---

Defined in: zip/build/plugin.d.ts:2

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

Defined in: zip/build/plugin.d.ts:3

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

Defined in: zip/build/plugin.d.ts:4

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
