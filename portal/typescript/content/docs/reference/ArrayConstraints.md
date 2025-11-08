---
editUrl: false
next: false
prev: false
title: "ArrayConstraints"
---

Defined in: metadata/build/field/types/Array.d.ts:14

Array-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `any`[][]

Defined in: metadata/build/field/types/Array.d.ts:31

Restrict values to a specified set of arrays
Serialized as JSON strings or parsed array objects

***

### jsonSchema?

> `optional` **jsonSchema**: `Record`\<`string`, `any`\>

Defined in: metadata/build/field/types/Array.d.ts:26

JSON Schema object for validating array items

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: metadata/build/field/types/Array.d.ts:22

Maximum array length

***

### minLength?

> `optional` **minLength**: `number`

Defined in: metadata/build/field/types/Array.d.ts:18

Minimum array length

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
