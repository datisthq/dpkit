---
editUrl: false
next: false
prev: false
title: "XlsxPlugin"
---

Defined in: table/build/plugins/xlxs/plugin.d.ts:4

## Implements

- [`TablePlugin`](/reference/tableplugin/)

## Constructors

### Constructor

> **new XlsxPlugin**(): `XlsxPlugin`

#### Returns

`XlsxPlugin`

## Methods

### loadTable()

> **loadTable**(`resource`, `options?`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: table/build/plugins/xlxs/plugin.d.ts:5

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

Defined in: table/build/plugins/xlxs/plugin.d.ts:6

#### Parameters

##### table

[`Table`](/reference/table/)

##### options

[`SaveTableOptions`](/reference/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/tableplugin/).[`saveTable`](/reference/tableplugin/#savetable)
