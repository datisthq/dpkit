---
editUrl: false
next: false
prev: false
title: "CsvPlugin"
---

Defined in: table/build/plugins/csv/plugin.d.ts:5

## Implements

- [`TablePlugin`](/reference/tableplugin/)

## Constructors

### Constructor

> **new CsvPlugin**(): `CsvPlugin`

#### Returns

`CsvPlugin`

## Methods

### loadTable()

> **loadTable**(`resource`, `options?`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: table/build/plugins/csv/plugin.d.ts:6

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/resource/)\>

##### options?

[`LoadTableOptions`](/reference/loadtableoptions/)

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`loadTable`](/reference/tableplugin/#loadtable)

***

### saveTable()

> **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: table/build/plugins/csv/plugin.d.ts:7

#### Parameters

##### table

[`Table`](/reference/table/)

##### options

[`SaveTableOptions`](/reference/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`saveTable`](/reference/tableplugin/#savetable)
