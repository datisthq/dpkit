---
editUrl: false
next: false
prev: false
title: "CsvPlugin"
---

Defined in: [plugin.ts:8](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/csv/plugin.ts#L8)

## Implements

- [`TablePlugin`](/reference/dpkit/tableplugin/)

## Constructors

### Constructor

> **new CsvPlugin**(): `CsvPlugin`

#### Returns

`CsvPlugin`

## Methods

### inferDialect()

> **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/dpkit/dialect/)\>

Defined in: [plugin.ts:9](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/csv/plugin.ts#L9)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/dpkit/resource/)\>

##### options?

[`InferDialectOptions`](/reference/dpkit/inferdialectoptions/)

#### Returns

`Promise`\<`undefined` \| [`Dialect`](/reference/dpkit/dialect/)\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`inferDialect`](/reference/dpkit/tableplugin/#inferdialect)

***

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\>

Defined in: [plugin.ts:19](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/csv/plugin.ts#L19)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/dpkit/resource/)\>

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`loadTable`](/reference/dpkit/tableplugin/#loadtable)

***

### saveTable()

> **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: [plugin.ts:26](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/csv/plugin.ts#L26)

#### Parameters

##### table

`LazyDataFrame`

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`saveTable`](/reference/dpkit/tableplugin/#savetable)
