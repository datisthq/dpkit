---
editUrl: false
next: false
prev: false
title: "DatetimeConstraints"
---

Defined in: core/build/field/types/Datetime.d.ts:21

Datetime-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/Datetime.d.ts:34

Restrict values to a specified set of datetimes
Should be in string datetime format (e.g., ISO8601)

***

### maximum?

> `optional` **maximum**: `string`

Defined in: core/build/field/types/Datetime.d.ts:29

Maximum allowed datetime value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: core/build/field/types/Datetime.d.ts:25

Minimum allowed datetime value

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
