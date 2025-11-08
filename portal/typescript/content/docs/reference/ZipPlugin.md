---
editUrl: false
next: false
prev: false
title: "ZipPlugin"
---

Defined in: dataset/build/plugins/zip/plugin.d.ts:3

## Implements

- [`DatasetPlugin`](/reference/datasetplugin/)

## Constructors

### Constructor

> **new ZipPlugin**(): `ZipPlugin`

#### Returns

`ZipPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/package/)\>

Defined in: dataset/build/plugins/zip/plugin.d.ts:4

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/package/)\>

#### Implementation of

[`DatasetPlugin`](/reference/datasetplugin/).[`loadPackage`](/reference/datasetplugin/#loadpackage)

***

### savePackage()

> **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

Defined in: dataset/build/plugins/zip/plugin.d.ts:5

#### Parameters

##### dataPackage

[`Package`](/reference/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path`: `undefined`; \}\>

#### Implementation of

[`DatasetPlugin`](/reference/datasetplugin/).[`savePackage`](/reference/datasetplugin/#savepackage)
