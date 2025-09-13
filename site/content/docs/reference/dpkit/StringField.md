---
editUrl: false
next: false
prev: false
title: "StringField"
---

Defined in: core/build/field/types/String.d.ts:5

String field type

## Extends

- `BaseField`\<[`StringConstraints`](/reference/dpkit/stringconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### categories?

> `optional` **categories**: `string`[] \| `object`[]

Defined in: core/build/field/types/String.d.ts:23

Categories for enum values
Can be an array of string values or an array of {value, label} objects

***

### categoriesOrdered?

> `optional` **categoriesOrdered**: `boolean`

Defined in: core/build/field/types/String.d.ts:30

Whether categories should be considered to have a natural order

***

### constraints?

> `optional` **constraints**: [`StringConstraints`](/reference/dpkit/stringconstraints/)

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

> `optional` **format**: `string`

Defined in: core/build/field/types/String.d.ts:18

Format of the string
- default: any valid string
- email: valid email address
- uri: valid URI
- binary: base64 encoded string
- uuid: valid UUID string

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

> **type**: `"string"`

Defined in: core/build/field/types/String.d.ts:9

Field type - discriminator property
