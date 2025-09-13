---
editUrl: false
next: false
prev: false
title: "ListConstraints"
---

Defined in: core/build/field/types/List.d.ts:22

List-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `any`[][]

Defined in: core/build/field/types/List.d.ts:35

Restrict values to a specified set of lists
Either as delimited strings or arrays

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: core/build/field/types/List.d.ts:30

Maximum number of list items

***

### minLength?

> `optional` **minLength**: `number`

Defined in: core/build/field/types/List.d.ts:26

Minimum number of list items

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
