---
editUrl: false
next: false
prev: false
title: "DurationConstraints"
---

Defined in: core/build/field/types/Duration.d.ts:14

Duration-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/Duration.d.ts:27

Restrict values to a specified set of durations
Should be in ISO 8601 duration format

***

### maximum?

> `optional` **maximum**: `string`

Defined in: core/build/field/types/Duration.d.ts:22

Maximum allowed duration (ISO 8601 format)

***

### minimum?

> `optional` **minimum**: `string`

Defined in: core/build/field/types/Duration.d.ts:18

Minimum allowed duration (ISO 8601 format)

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
