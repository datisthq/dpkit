---
editUrl: false
next: false
prev: false
title: "GeopointConstraints"
---

Defined in: core/build/field/types/Geopoint.d.ts:21

Geopoint-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[][] \| `Record`\<`string`, `number`\>[]

Defined in: core/build/field/types/Geopoint.d.ts:26

Restrict values to a specified set of geopoints
Format depends on the field's format setting

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
