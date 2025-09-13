---
editUrl: false
next: false
prev: false
title: "TablePlugin"
---

Defined in: [table/plugin.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/table/plugin.ts#L11)

## Extends

- [`Plugin`](/reference/_dpkit/core/plugin/)

## Methods

### inferDialect()?

> `optional` **inferDialect**(`resource`, `options?`): `Promise`\<`undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/)\>

Defined in: [table/plugin.ts:12](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/table/plugin.ts#L12)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/_dpkit/core/resource/)\>

##### options?

[`InferDialectOptions`](/reference/_dpkit/table/inferdialectoptions/)

#### Returns

`Promise`\<`undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/)\>

***

### loadPackage()?

> `optional` **loadPackage**(`source`): `Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

Defined in: core/build/plugin.d.ts:3

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| [`Package`](/reference/_dpkit/core/package/)\>

#### Inherited from

[`Plugin`](/reference/_dpkit/core/plugin/).[`loadPackage`](/reference/_dpkit/core/plugin/#loadpackage)

***

### loadTable()?

> `optional` **loadTable**(`resource`): `Promise`\<`undefined` \| [`Table`](/reference/_dpkit/table/table/)\>

Defined in: [table/plugin.ts:17](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/table/plugin.ts#L17)

#### Parameters

##### resource

`Partial`\<[`Resource`](/reference/_dpkit/core/resource/)\>

#### Returns

`Promise`\<`undefined` \| [`Table`](/reference/_dpkit/table/table/)\>

***

### savePackage()?

> `optional` **savePackage**(`dataPackage`, `options`): `Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

Defined in: core/build/plugin.d.ts:4

#### Parameters

##### dataPackage

[`Package`](/reference/_dpkit/core/package/)

##### options

###### target

`string`

###### withRemote?

`boolean`

#### Returns

`Promise`\<`undefined` \| \{ `path?`: `string`; \}\>

#### Inherited from

[`Plugin`](/reference/_dpkit/core/plugin/).[`savePackage`](/reference/_dpkit/core/plugin/#savepackage)

***

### saveTable()?

> `optional` **saveTable**(`table`, `options`): `Promise`\<`undefined` \| `string`\>

Defined in: [table/plugin.ts:19](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/table/plugin.ts#L19)

#### Parameters

##### table

[`Table`](/reference/_dpkit/table/table/)

##### options

[`SaveTableOptions`](/reference/_dpkit/table/savetableoptions/)

#### Returns

`Promise`\<`undefined` \| `string`\>
