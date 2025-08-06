---
editUrl: false
next: false
prev: false
title: "ObjectConstraints"
---

Defined in: core/build/field/types/Object.d.ts:14

Object-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `Record`\<`string`, `any`\>[]

Defined in: core/build/field/types/Object.d.ts:31

Restrict values to a specified set of objects
Serialized as JSON strings or object literals

***

### jsonSchema?

> `optional` **jsonSchema**: `Record`\<`string`, `any`\>

Defined in: core/build/field/types/Object.d.ts:26

JSON Schema object for validating the object structure and properties

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: core/build/field/types/Object.d.ts:22

Maximum number of properties

***

### minLength?

> `optional` **minLength**: `number`

Defined in: core/build/field/types/Object.d.ts:18

Minimum number of properties

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
