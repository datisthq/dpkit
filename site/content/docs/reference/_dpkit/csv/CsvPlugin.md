---
editUrl: false
next: false
prev: false
title: "CsvPlugin"
---

Defined in: [plugin.ts:8](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/csv/plugin.ts#L8)

## Implements

- [`TablePlugin`](/reference/dpkit/tableplugin/)

## Constructors

### Constructor

> **new CsvPlugin**(): `CsvPlugin`

#### Returns

`CsvPlugin`

## Methods

### inferDialect()

> **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/)\>

Defined in: [plugin.ts:9](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/csv/plugin.ts#L9)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/_dpkit/core/resource/)\>

##### options?

[`InferDialectOptions`](/reference/dpkit/inferdialectoptions/)

#### Returns

`Promise`\<`undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/)\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`inferDialect`](/reference/dpkit/tableplugin/#inferdialect)

***

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: [plugin.ts:19](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/csv/plugin.ts#L19)

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

Defined in: [plugin.ts:26](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/csv/plugin.ts#L26)

#### Parameters

##### table

[`Table`](/reference/dpkit/table/)

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`saveTable`](/reference/dpkit/tableplugin/#savetable)
