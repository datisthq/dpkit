---
editUrl: false
next: false
prev: false
title: "XlsxPlugin"
---

Defined in: [plugin.ts:7](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/xlsx/plugin.ts#L7)

## Implements

- [`TablePlugin`](/reference/_dpkit/table/tableplugin/)

## Constructors

### Constructor

> **new XlsxPlugin**(): `XlsxPlugin`

#### Returns

`XlsxPlugin`

## Methods

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

Defined in: [plugin.ts:8](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/xlsx/plugin.ts#L8)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/_dpkit/core/resource/)\>

#### Returns

`Promise`\<`undefined` \| `LazyDataFrame`\<`any`\>\>

#### Implementation of

[`TablePlugin`](/reference/_dpkit/table/tableplugin/).[`loadTable`](/reference/_dpkit/table/tableplugin/#loadtable)

***

### saveTable()

> **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: [plugin.ts:15](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/xlsx/plugin.ts#L15)

#### Parameters

##### table

[`Table`](/reference/_dpkit/table/table/)

##### options

[`SaveTableOptions`](/reference/_dpkit/table/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/_dpkit/table/tableplugin/).[`saveTable`](/reference/_dpkit/table/tableplugin/#savetable)
