---
editUrl: false
next: false
prev: false
title: "GeopointField"
---

Defined in: core/build/field/types/Geopoint.d.ts:5

Geopoint field type

## Extends

- `BaseField`\<[`GeopointConstraints`](/reference/dpkit/geopointconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`GeopointConstraints`](/reference/dpkit/geopointconstraints/)

Defined in: core/build/field/types/Base.d.ts:38

Validation constraints applied to values

#### Inherited from

`BaseField.constraints`

***

### description?

> `optional` **description**: `string`

Defined in: core/build/field/types/Base.d.ts:17

Human-readable description

#### Inherited from

`BaseField.description`

***

### example?

> `optional` **example**: `any`

Defined in: core/build/field/types/Base.d.ts:21

Example value for this field

#### Inherited from

`BaseField.example`

***

### format?

> `optional` **format**: `"object"` \| `"default"` \| `"array"`

Defined in: core/build/field/types/Geopoint.d.ts:16

Format of the geopoint
- default: "lon,lat" string with comma separator
- array: [lon,lat] array
- object: {lon:x, lat:y} object

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: core/build/field/types/Base.d.ts:31

Values representing missing data for this field
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

#### Inherited from

`BaseField.missingValues`

***

### name

> **name**: `string`

Defined in: core/build/field/types/Base.d.ts:9

Name of the field matching the column name

#### Inherited from

`BaseField.name`

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: core/build/field/types/Base.d.ts:25

URI for semantic type (RDF)

#### Inherited from

`BaseField.rdfType`

***

### title?

> `optional` **title**: `string`

Defined in: core/build/field/types/Base.d.ts:13

Human-readable title

#### Inherited from

`BaseField.title`

***

### type

> **type**: `"geopoint"`

Defined in: core/build/field/types/Geopoint.d.ts:9

Field type - discriminator property
