---
editUrl: false
next: false
prev: false
title: "TimeConstraints"
---

Defined in: metadata/build/field/types/Time.d.ts:21

Time-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: metadata/build/field/types/Time.d.ts:42

Restrict values to a specified set of times
Should be in string time format (e.g., "HH:MM:SS")

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string`

Defined in: metadata/build/field/types/Time.d.ts:37

Exclusive maximum time value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string`

Defined in: metadata/build/field/types/Time.d.ts:33

Exclusive minimum time value

***

### maximum?

> `optional` **maximum**: `string`

Defined in: metadata/build/field/types/Time.d.ts:29

Maximum allowed time value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: metadata/build/field/types/Time.d.ts:25

Minimum allowed time value

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
