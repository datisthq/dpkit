---
editUrl: false
next: false
prev: false
title: "DateConstraints"
---

Defined in: [core/field/types/Date.ts:24](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Date.ts#L24)

Date-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/Date.ts:39](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Date.ts#L39)

Restrict values to a specified set of dates
Should be in string date format (e.g., "YYYY-MM-DD")

***

### maximum?

> `optional` **maximum**: `string`

Defined in: [core/field/types/Date.ts:33](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Date.ts#L33)

Maximum allowed date value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: [core/field/types/Date.ts:28](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Date.ts#L28)

Minimum allowed date value

***

### required?

> `optional` **required**: `boolean`

Defined in: [core/field/types/Base.ts:52](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Base.ts#L52)

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: [core/field/types/Base.ts:57](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Base.ts#L57)

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
