---
editUrl: false
next: false
prev: false
title: "TimeConstraints"
---

Defined in: core/build/field/types/Time.d.ts:21

Time-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/Time.d.ts:34

Restrict values to a specified set of times
Should be in string time format (e.g., "HH:MM:SS")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: core/build/field/types/Time.d.ts:29

Maximum allowed time value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: core/build/field/types/Time.d.ts:25

Minimum allowed time value

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
