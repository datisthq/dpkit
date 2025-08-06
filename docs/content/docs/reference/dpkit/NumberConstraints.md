---
editUrl: false
next: false
prev: false
title: "NumberConstraints"
---

Defined in: core/build/field/types/Number.d.ts:26

Number-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: core/build/field/types/Number.d.ts:47

Restrict values to a specified set
Can be an array of numbers or strings that parse to numbers

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string` \| `number`

Defined in: core/build/field/types/Number.d.ts:42

Exclusive maximum allowed value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string` \| `number`

Defined in: core/build/field/types/Number.d.ts:38

Exclusive minimum allowed value

***

### maximum?

> `optional` **maximum**: `string` \| `number`

Defined in: core/build/field/types/Number.d.ts:34

Maximum allowed value

***

### minimum?

> `optional` **minimum**: `string` \| `number`

Defined in: core/build/field/types/Number.d.ts:30

Minimum allowed value

***

### required?

> `optional` **required**: `boolean`

Defined in: core/build/field/types/Base.d.ts:47

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: core/build/field/types/Base.d.ts:51

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
