---
editUrl: false
next: false
prev: false
title: "TimeConstraints"
---

Defined in: [core/field/types/Time.ts:24](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Time.ts#L24)

Time-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/Time.ts:39](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Time.ts#L39)

Restrict values to a specified set of times
Should be in string time format (e.g., "HH:MM:SS")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: [core/field/types/Time.ts:33](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Time.ts#L33)

Maximum allowed time value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: [core/field/types/Time.ts:28](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Time.ts#L28)

Minimum allowed time value

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
