---
editUrl: false
next: false
prev: false
title: "DateConstraints"
---

Defined in: metadata/build/field/types/Date.d.ts:21

Date-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: metadata/build/field/types/Date.d.ts:42

Restrict values to a specified set of dates
Should be in string date format (e.g., "YYYY-MM-DD")

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string`

Defined in: metadata/build/field/types/Date.d.ts:37

Exclusive maximum date value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string`

Defined in: metadata/build/field/types/Date.d.ts:33

Exclusive minimum date value

***

### maximum?

> `optional` **maximum**: `string`

Defined in: metadata/build/field/types/Date.d.ts:29

Maximum allowed date value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: metadata/build/field/types/Date.d.ts:25

Minimum allowed date value

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
