---
editUrl: false
next: false
prev: false
title: "YearmonthConstraints"
---

Defined in: [core/field/types/Yearmonth.ts:16](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Yearmonth.ts#L16)

Yearmonth-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/Yearmonth.ts:31](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Yearmonth.ts#L31)

Restrict values to a specified set of yearmonths
Should be in string format (e.g., "YYYY-MM")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: [core/field/types/Yearmonth.ts:25](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Yearmonth.ts#L25)

Maximum allowed yearmonth value (format: YYYY-MM)

***

### minimum?

> `optional` **minimum**: `string`

Defined in: [core/field/types/Yearmonth.ts:20](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Yearmonth.ts#L20)

Minimum allowed yearmonth value (format: YYYY-MM)

***

### required?

> `optional` **required**: `boolean`

Defined in: [core/field/types/Base.ts:52](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L52)

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: [core/field/types/Base.ts:57](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L57)

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
