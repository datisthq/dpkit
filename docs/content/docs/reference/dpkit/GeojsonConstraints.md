---
editUrl: false
next: false
prev: false
title: "GeojsonConstraints"
---

Defined in: core/build/field/types/Geojson.d.ts:20

GeoJSON-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `Record`\<`string`, `any`\>[]

Defined in: core/build/field/types/Geojson.d.ts:25

Restrict values to a specified set of GeoJSON objects
Serialized as strings or GeoJSON object literals

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
