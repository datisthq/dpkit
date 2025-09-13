---
editUrl: false
next: false
prev: false
title: "GeopointConstraints"
---

Defined in: [core/field/types/Geopoint.ts:24](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Geopoint.ts#L24)

Geopoint-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[][] \| `Record`\<`string`, `number`\>[]

Defined in: [core/field/types/Geopoint.ts:29](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Geopoint.ts#L29)

Restrict values to a specified set of geopoints
Format depends on the field's format setting

***

### required?

> `optional` **required**: `boolean`

Defined in: [core/field/types/Base.ts:52](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L52)

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: [core/field/types/Base.ts:57](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L57)

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
