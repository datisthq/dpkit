---
editUrl: false
next: false
prev: false
title: "AnyConstraints"
---

Defined in: [core/field/types/Any.ts:16](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Any.ts#L16)

Any field constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `any`[]

Defined in: [core/field/types/Any.ts:21](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Any.ts#L21)

Restrict values to a specified set
For any field type, can be an array of any values

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
