---
editUrl: false
next: false
prev: false
title: "StringConstraints"
---

Defined in: core/build/field/types/String.d.ts:35

String-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: core/build/field/types/String.d.ts:51

Restrict values to a specified set of strings

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: core/build/field/types/String.d.ts:43

Maximum string length

***

### minLength?

> `optional` **minLength**: `number`

Defined in: core/build/field/types/String.d.ts:39

Minimum string length

***

### pattern?

> `optional` **pattern**: `string`

Defined in: core/build/field/types/String.d.ts:47

Regular expression pattern to match

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
