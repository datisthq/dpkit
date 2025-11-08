---
editUrl: false
next: false
prev: false
title: "YearConstraints"
---

Defined in: metadata/build/field/types/Year.d.ts:14

Year-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: metadata/build/field/types/Year.d.ts:35

Restrict values to a specified set of years
Can be an array of numbers or strings that parse to years

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string` \| `number`

Defined in: metadata/build/field/types/Year.d.ts:30

Exclusive maximum year value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string` \| `number`

Defined in: metadata/build/field/types/Year.d.ts:26

Exclusive minimum year value

***

### maximum?

> `optional` **maximum**: `string` \| `number`

Defined in: metadata/build/field/types/Year.d.ts:22

Maximum allowed year

***

### minimum?

> `optional` **minimum**: `string` \| `number`

Defined in: metadata/build/field/types/Year.d.ts:18

Minimum allowed year

***

### required?

> `optional` **required**: `boolean`

Defined in: metadata/build/field/types/Base.d.ts:55

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: metadata/build/field/types/Base.d.ts:59

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
