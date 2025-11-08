---
editUrl: false
next: false
prev: false
title: "DatetimeConstraints"
---

Defined in: metadata/build/field/types/Datetime.d.ts:21

Datetime-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: metadata/build/field/types/Datetime.d.ts:42

Restrict values to a specified set of datetimes
Should be in string datetime format (e.g., ISO8601)

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string`

Defined in: metadata/build/field/types/Datetime.d.ts:37

Exclusive maximum datetime value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string`

Defined in: metadata/build/field/types/Datetime.d.ts:33

Exclusive minimum datetime value

***

### maximum?

> `optional` **maximum**: `string`

Defined in: metadata/build/field/types/Datetime.d.ts:29

Maximum allowed datetime value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: metadata/build/field/types/Datetime.d.ts:25

Minimum allowed datetime value

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
