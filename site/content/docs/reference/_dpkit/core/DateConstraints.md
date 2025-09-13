---
editUrl: false
next: false
prev: false
title: "DateConstraints"
---

Defined in: [core/field/types/Date.ts:24](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L24)

Date-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/Date.ts:39](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L39)

Restrict values to a specified set of dates
Should be in string date format (e.g., "YYYY-MM-DD")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: [core/field/types/Date.ts:33](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L33)

Maximum allowed date value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: [core/field/types/Date.ts:28](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L28)

Minimum allowed date value

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
