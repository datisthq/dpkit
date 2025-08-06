---
editUrl: false
next: false
prev: false
title: "CsvPlugin"
---

Defined in: csv/build/plugin.d.ts:4

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

Defined in: csv/build/plugin.d.ts:5

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

Defined in: csv/build/plugin.d.ts:6

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

Defined in: csv/build/plugin.d.ts:7

#### Parameters

##### table

`LazyDataFrame`

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`saveTable`](/reference/dpkit/tableplugin/#savetable)
