---
editUrl: false
next: false
prev: false
title: "DateConstraints"
---

Defined in: core/build/field/types/Date.d.ts:21

Date-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/Date.d.ts:34

Restrict values to a specified set of dates
Should be in string date format (e.g., "YYYY-MM-DD")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: core/build/field/types/Date.d.ts:29

Maximum allowed date value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: core/build/field/types/Date.d.ts:25

Minimum allowed date value

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
