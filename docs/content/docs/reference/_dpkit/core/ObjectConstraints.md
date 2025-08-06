---
editUrl: false
next: false
prev: false
title: "ObjectConstraints"
---

Defined in: [core/field/types/Object.ts:16](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Object.ts#L16)

Object-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `Record`\<`string`, `any`\>[]

Defined in: [core/field/types/Object.ts:36](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Object.ts#L36)

Restrict values to a specified set of objects
Serialized as JSON strings or object literals

***

### jsonSchema?

> `optional` **jsonSchema**: `Record`\<`string`, `any`\>

Defined in: [core/field/types/Object.ts:30](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Object.ts#L30)

JSON Schema object for validating the object structure and properties

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [core/field/types/Object.ts:25](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Object.ts#L25)

Maximum number of properties

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [core/field/types/Object.ts:20](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/field/types/Object.ts#L20)

Minimum number of properties

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
