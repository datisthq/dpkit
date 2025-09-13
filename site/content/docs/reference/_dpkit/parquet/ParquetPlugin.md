---
editUrl: false
next: false
prev: false
title: "ParquetPlugin"
---

Defined in: [plugin.ts:7](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/parquet/plugin.ts#L7)

## Implements

- [`TablePlugin`](/reference/dpkit/tableplugin/)

## Constructors

### Constructor

> **new ParquetPlugin**(): `ParquetPlugin`

#### Returns

`ParquetPlugin`

## Methods

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: [plugin.ts:8](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/parquet/plugin.ts#L8)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/_dpkit/core/resource/)\>

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`loadTable`](/reference/dpkit/tableplugin/#loadtable)

***

### saveTable()

> **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: [plugin.ts:15](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/parquet/plugin.ts#L15)

#### Parameters

##### table

[`Table`](/reference/dpkit/table/)

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`saveTable`](/reference/dpkit/tableplugin/#savetable)
