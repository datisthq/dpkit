---
editUrl: false
next: false
prev: false
title: "TablePlugin"
---

Defined in: table/build/plugin.d.ts:17

## Extends

- [`DatasetPlugin`](/reference/datasetplugin/)

## Methods

### inferDialect()?

> `optional` **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/dialect/)\>

Defined in: table/build/plugin.d.ts:23

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

##### options?

[`InferDialectOptions`](/reference/inferdialectoptions/)

#### Returns

`Promise`\<`undefined` \| [`Dialect`](/reference/dialect/)\>

***

### inferSchema()?

> `optional` **inferSchema**(`resource`, `options?`): `Promise`\<`undefined` \| [`Schema`](/reference/schema/)\>

Defined in: table/build/plugin.d.ts:24

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

##### options?

[`InferSchemaOptions`](/reference/inferschemaoptions/)

#### Returns

`Promise`\<`undefined` \| [`Schema`](/reference/schema/)\>

***

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/package/)\>

Defined in: dataset/build/plugin.d.ts:7

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/package/)\>

#### Inherited from

[`DatasetPlugin`](/reference/datasetplugin/).[`loadPackage`](/reference/datasetplugin/#loadpackage)

***

### loadTable()?

> `optional` **loadTable**(`resource`, `options?`): `Promise`\<`undefined` \| [`Table`](/reference/table/)\>

Defined in: table/build/plugin.d.ts:25

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

##### options?

[`LoadTableOptions`](/reference/loadtableoptions/)

#### Returns

`Promise`\<`undefined` \| [`Table`](/reference/table/)\>

***

### savePackage()?

> `optional` **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

Defined in: table/build/plugin.d.ts:18

#### Parameters

##### dataPackage

[`Package`](/reference/package/)

##### options

[`SavePackageOptions`](/reference/savepackageoptions/) & `object`

#### Returns

`Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

#### Overrides

[`DatasetPlugin`](/reference/datasetplugin/).[`savePackage`](/reference/datasetplugin/#savepackage)

***

### saveTable()?

> `optional` **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: table/build/plugin.d.ts:26

#### Parameters

##### table

[`Table`](/reference/table/)

##### options

[`SaveTableOptions`](/reference/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>
