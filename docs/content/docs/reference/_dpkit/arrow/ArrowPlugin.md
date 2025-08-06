---
editUrl: false
next: false
prev: false
title: "ArrowPlugin"
---

Defined in: [plugin.ts:7](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/arrow/plugin.ts#L7)

## Implements

- [`TablePlugin`](/reference/dpkit/tableplugin/)

## Constructors

### Constructor

> **new ArrowPlugin**(): `ArrowPlugin`

#### Returns

`ArrowPlugin`

## Methods

### loadTable()

> **loadTable**(`resource`): `Promise`\<`undefined` \| `LazyDataFrame`\>

Defined in: [plugin.ts:8](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/arrow/plugin.ts#L8)

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

Defined in: [plugin.ts:15](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/arrow/plugin.ts#L15)

#### Parameters

##### table

`LazyDataFrame`

##### options

[`SaveTableOptions`](/reference/dpkit/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>

#### Implementation of

[`TablePlugin`](/reference/dpkit/tableplugin/).[`saveTable`](/reference/dpkit/tableplugin/#savetable)
