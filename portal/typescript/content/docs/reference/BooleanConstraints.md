---
editUrl: false
next: false
prev: false
title: "BooleanConstraints"
---

Defined in: metadata/build/field/types/Boolean.d.ts:22

Boolean-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `boolean`[]

Defined in: metadata/build/field/types/Boolean.d.ts:27

Restrict values to a specified set
Can be an array of booleans or strings that parse to booleans

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
