---
editUrl: false
next: false
prev: false
title: "NumberConstraints"
---

Defined in: [core/field/types/Number.ts:31](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L31)

Number-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: [core/field/types/Number.ts:56](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L56)

Restrict values to a specified set
Can be an array of numbers or strings that parse to numbers

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string` \| `number`

Defined in: [core/field/types/Number.ts:50](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L50)

Exclusive maximum allowed value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string` \| `number`

Defined in: [core/field/types/Number.ts:45](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L45)

Exclusive minimum allowed value

***

### maximum?

> `optional` **maximum**: `string` \| `number`

Defined in: [core/field/types/Number.ts:40](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L40)

Maximum allowed value

***

### minimum?

> `optional` **minimum**: `string` \| `number`

Defined in: [core/field/types/Number.ts:35](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Number.ts#L35)

Minimum allowed value

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
