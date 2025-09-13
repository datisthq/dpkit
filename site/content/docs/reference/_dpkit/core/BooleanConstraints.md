---
editUrl: false
next: false
prev: false
title: "BooleanConstraints"
---

Defined in: [core/field/types/Boolean.ts:26](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Boolean.ts#L26)

Boolean-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `boolean`[]

Defined in: [core/field/types/Boolean.ts:31](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Boolean.ts#L31)

Restrict values to a specified set
Can be an array of booleans or strings that parse to booleans

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
