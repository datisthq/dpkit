---
editUrl: false
next: false
prev: false
title: "YearConstraints"
---

Defined in: core/build/field/types/Year.d.ts:14

Year-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: core/build/field/types/Year.d.ts:27

Restrict values to a specified set of years
Can be an array of numbers or strings that parse to years

***

### maximum?

> `optional` **maximum**: `number`

Defined in: core/build/field/types/Year.d.ts:22

Maximum allowed year

***

### minimum?

> `optional` **minimum**: `number`

Defined in: core/build/field/types/Year.d.ts:18

Minimum allowed year

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
