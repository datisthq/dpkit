---
editUrl: false
next: false
prev: false
title: "StringConstraints"
---

Defined in: [core/field/types/String.ts:37](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/String.ts#L37)

String-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[]

Defined in: [core/field/types/String.ts:56](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/String.ts#L56)

Restrict values to a specified set of strings

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [core/field/types/String.ts:46](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/String.ts#L46)

Maximum string length

***

### minLength?

> `optional` **minLength**: `number`

Defined in: [core/field/types/String.ts:41](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/String.ts#L41)

Minimum string length

***

### pattern?

> `optional` **pattern**: `string`

Defined in: [core/field/types/String.ts:51](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/String.ts#L51)

Regular expression pattern to match

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
