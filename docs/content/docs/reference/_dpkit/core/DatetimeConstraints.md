---
editUrl: false
next: false
prev: false
title: "DatetimeConstraints"
---

Defined in: [core/field/types/Datetime.ts:24](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Datetime.ts#L24)

Datetime-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/Datetime.ts:39](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Datetime.ts#L39)

Restrict values to a specified set of datetimes
Should be in string datetime format (e.g., ISO8601)

***

### maximum?

> `optional` **maximum**: `string`

Defined in: [core/field/types/Datetime.ts:33](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Datetime.ts#L33)

Maximum allowed datetime value

***

### minimum?

> `optional` **minimum**: `string`

Defined in: [core/field/types/Datetime.ts:28](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Datetime.ts#L28)

Minimum allowed datetime value

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
