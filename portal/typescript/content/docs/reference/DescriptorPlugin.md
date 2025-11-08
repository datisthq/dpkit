---
editUrl: false
next: false
prev: false
title: "DescriptorPlugin"
---

Defined in: dataset/build/plugins/descriptor/plugin.d.ts:3

## Implements

- [`DatasetPlugin`](/reference/datasetplugin/)

## Constructors

### Constructor

> **new DescriptorPlugin**(): `DescriptorPlugin`

#### Returns

`DescriptorPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/package/)\>

Defined in: dataset/build/plugins/descriptor/plugin.d.ts:4

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/package/)\>

#### Implementation of

[`DatasetPlugin`](/reference/datasetplugin/).[`loadPackage`](/reference/datasetplugin/#loadpackage)

***

### savePackage()

> **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path`: `string`; \}\>

Defined in: dataset/build/plugins/descriptor/plugin.d.ts:5

#### Parameters

##### dataPackage

[`Package`](/reference/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path`: `string`; \}\>

#### Implementation of

[`DatasetPlugin`](/reference/datasetplugin/).[`savePackage`](/reference/datasetplugin/#savepackage)
