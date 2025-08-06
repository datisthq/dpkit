---
editUrl: false
next: false
prev: false
title: "TablePlugin"
---

Defined in: [table/plugin.ts:7](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/table/plugin.ts#L7)

## Extends

- [`Plugin`](/reference/dpkit/plugin/)

## Methods

### inferDialect()?

> `optional` **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/dpkit/dialect/)\>

Defined in: [table/plugin.ts:8](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/table/plugin.ts#L8)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/dpkit/resource/)\>

##### options?

[`InferDialectOptions`](/reference/_dpkit/table/inferdialectoptions/)

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

Defined in: [table/plugin.ts:13](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/table/plugin.ts#L13)

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

Defined in: [table/plugin.ts:15](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/table/plugin.ts#L15)

#### Parameters

##### table

`LazyDataFrame`

##### options

[`SaveTableOptions`](/reference/_dpkit/table/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>
