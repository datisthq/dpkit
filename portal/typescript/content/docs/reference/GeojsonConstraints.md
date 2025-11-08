---
editUrl: false
next: false
prev: false
title: "GeojsonConstraints"
---

Defined in: metadata/build/field/types/Geojson.d.ts:20

GeoJSON-specific constraints

## Extends

- `BaseConstraints`

## Properties

### enum?

> `optional` **enum**: `string`[] \| `Record`\<`string`, `any`\>[]

Defined in: metadata/build/field/types/Geojson.d.ts:29

Restrict values to a specified set of GeoJSON objects
Serialized as strings or GeoJSON object literals

***

### jsonSchema?

> `optional` **jsonSchema**: `Record`\<`string`, `any`\>

Defined in: metadata/build/field/types/Geojson.d.ts:24

JSON Schema object for validating the object structure and properties

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
