---
editUrl: false
next: false
prev: false
title: "IntegerConstraints"
---

Defined in: metadata/build/field/types/Integer.d.ts:35

**`Internal`**

Integer-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `number`[]

Defined in: metadata/build/field/types/Integer.d.ts:56

Restrict values to a specified set
Can be an array of integers or strings that parse to integers

***

### exclusiveMaximum?

> `optional` **exclusiveMaximum**: `string` \| `number`

Defined in: metadata/build/field/types/Integer.d.ts:51

Exclusive maximum allowed value

***

### exclusiveMinimum?

> `optional` **exclusiveMinimum**: `string` \| `number`

Defined in: metadata/build/field/types/Integer.d.ts:47

Exclusive minimum allowed value

***

### maximum?

> `optional` **maximum**: `string` \| `number`

Defined in: metadata/build/field/types/Integer.d.ts:43

Maximum allowed value

***

### minimum?

> `optional` **minimum**: `string` \| `number`

Defined in: metadata/build/field/types/Integer.d.ts:39

Minimum allowed value

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
