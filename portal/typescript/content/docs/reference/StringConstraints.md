---
editUrl: false
next: false
prev: false
title: "StringConstraints"
---

Defined in: metadata/build/field/types/String.d.ts:34

String-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: metadata/build/field/types/String.d.ts:50

Restrict values to a specified set of strings

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: metadata/build/field/types/String.d.ts:42

Maximum string length

***

### minLength?

> `optional` **minLength**: `number`

Defined in: metadata/build/field/types/String.d.ts:38

Minimum string length

***

### pattern?

> `optional` **pattern**: `string`

Defined in: metadata/build/field/types/String.d.ts:46

Regular expression pattern to match

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
