---
editUrl: false
next: false
prev: false
title: "TablePlugin"
---

Defined in: table/build/plugin.d.ts:10

## Extends

- [`Plugin`](/reference/dpkit/plugin/)

## Methods

### inferDialect()?

> `optional` **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/dpkit/dialect/)\>

Defined in: table/build/plugin.d.ts:11

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/dpkit/resource/)\>

##### options?

[`InferDialectOptions`](/reference/dpkit/inferdialectoptions/)

#### Returns

`Promise`\<`undefined` \| [`Dialect`](/reference/dpkit/dialect/)\>

***

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

Defined in: core/build/plugin.d.ts:3

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/dpkit/package/)\>

#### Inherited from

[`Plugin`](/reference/dpkit/plugin/).[`loadPackage`](/reference/dpkit/plugin/#loadpackage)

***

### loadTable()?

> `optional` **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\>

Defined in: table/build/plugin.d.ts:12

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/dpkit/resource/)\>

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\>

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

#### Inherited from

[`Plugin`](/reference/dpkit/plugin/).[`savePackage`](/reference/dpkit/plugin/#savepackage)

***

### saveTable()?

> `optional` **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: table/build/plugin.d.ts:13

#### Parameters

##### table

`LazyDataFrame`

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>
