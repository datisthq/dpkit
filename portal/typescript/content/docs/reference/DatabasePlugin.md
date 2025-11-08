---
editUrl: false
next: false
prev: false
title: "DatabasePlugin"
---

Defined in: database/build/plugin.d.ts:5

## Implements

- [`TablePlugin`](/reference/tableplugin/)

## Constructors

### Constructor

> **new DatabasePlugin**(): `DatabasePlugin`

#### Returns

`DatabasePlugin`

## Methods

### inferSchema()

> **inferSchema**(`resource`): `Promise`\<`undefined` \| [`Schema`](/reference/schema/)\>

Defined in: database/build/plugin.d.ts:12

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

#### Returns

`Promise`\<`undefined` \| [`Schema`](/reference/schema/)\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`inferSchema`](/reference/tableplugin/#inferschema)

***

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/package/)\>

Defined in: database/build/plugin.d.ts:11

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/package/)\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`loadPackage`](/reference/tableplugin/#loadpackage)

***

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: database/build/plugin.d.ts:13

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`loadTable`](/reference/tableplugin/#loadtable)

***

### savePackage()

> **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path`: `string`; \}\>

Defined in: database/build/plugin.d.ts:6

#### Parameters

##### dataPackage

[`Package`](/reference/package/)

##### options

[`SavePackageOptions`](/reference/savepackageoptions/) & `object`

#### Returns

`Promise`\<`undefined` \| \{ `path`: `string`; \}\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`savePackage`](/reference/tableplugin/#savepackage)

***

### saveTable()

> **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: database/build/plugin.d.ts:14

#### Parameters

##### table

[`Table`](/reference/table/)

##### options

[`SaveTableOptions`](/reference/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`saveTable`](/reference/tableplugin/#savetable)
