---
editUrl: false
next: false
prev: false
title: "IntegerConstraints"
---

Defined in: [core/field/types/Integer.ts:38](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L38)

**`Internal`**

Integer-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: [core/field/types/Integer.ts:63](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L63)

Restrict values to a specified set
Can be an array of integers or strings that parse to integers

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string` \| `number`

Defined in: [core/field/types/Integer.ts:57](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L57)

Exclusive maximum allowed value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string` \| `number`

Defined in: [core/field/types/Integer.ts:52](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L52)

Exclusive minimum allowed value

***

### maximum?

> `optional` **maximum**: `string` \| `number`

Defined in: [core/field/types/Integer.ts:47](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L47)

Maximum allowed value

***

### minimum?

> `optional` **minimum**: `string` \| `number`

Defined in: [core/field/types/Integer.ts:42](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Integer.ts#L42)

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
