---
editUrl: false
next: false
prev: false
title: "YearmonthConstraints"
---

Defined in: core/build/field/types/Yearmonth.d.ts:14

Yearmonth-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/Yearmonth.d.ts:27

Restrict values to a specified set of yearmonths
Should be in string format (e.g., "YYYY-MM")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: core/build/field/types/Yearmonth.d.ts:22

Maximum allowed yearmonth value (format: YYYY-MM)

***

### minimum?

> `optional` **minimum**: `string`

Defined in: core/build/field/types/Yearmonth.d.ts:18

Minimum allowed yearmonth value (format: YYYY-MM)

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
