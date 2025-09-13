---
editUrl: false
next: false
prev: false
title: "ListConstraints"
---

Defined in: [core/field/types/List.ts:33](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/List.ts#L33)

List-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `any`[][]

Defined in: [core/field/types/List.ts:48](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/List.ts#L48)

Restrict values to a specified set of lists
Either as delimited strings or arrays

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [core/field/types/List.ts:42](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/List.ts#L42)

Maximum number of list items

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [core/field/types/List.ts:37](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/List.ts#L37)

Minimum number of list items

***

### required?

> `optional` **required**: `boolean`

Defined in: [core/field/types/Base.ts:52](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L52)

Indicates if field is allowed to be null/empty

#### Inherited from

`BaseConstraints.required`

***

### unique?

> `optional` **unique**: `boolean`

Defined in: [core/field/types/Base.ts:57](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L57)

Indicates if values must be unique within the column

#### Inherited from

`BaseConstraints.unique`
