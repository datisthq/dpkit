---
editUrl: false
next: false
prev: false
title: "YearField"
---

Defined in: metadata/build/field/types/Year.d.ts:5

Year field type

## Extends

- `BaseField`\<[`YearConstraints`](/reference/yearconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`YearConstraints`](/reference/yearconstraints/)

Defined in: metadata/build/field/types/Base.d.ts:46

Validation constraints applied to values

#### Inherited from

`BaseField.constraints`

***

### description?

> `optional` **description**: `string`

Defined in: metadata/build/field/types/Base.d.ts:21

Human-readable description

#### Inherited from

`BaseField.description`

***

### example?

> `optional` **example**: `any`

Defined in: metadata/build/field/types/Base.d.ts:25

Example value for this field

#### Inherited from

`BaseField.example`

***

### examples?

> `optional` **examples**: `any`[]

Defined in: metadata/build/field/types/Base.d.ts:29

Examples for this field

#### Inherited from

`BaseField.examples`

***

### format?

> `optional` **format**: `string`

Defined in: metadata/build/field/types/Base.d.ts:13

Field format -- optional addition to the type

#### Inherited from

`BaseField.format`

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: metadata/build/field/types/Base.d.ts:39

Values representing missing data for this field
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

#### Inherited from

`BaseField.missingValues`

***

### name

> **name**: `string`

Defined in: metadata/build/field/types/Base.d.ts:9

Name of the field matching the column name

#### Inherited from

`BaseField.name`

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: metadata/build/field/types/Base.d.ts:33

URI for semantic type (RDF)

#### Inherited from

`BaseField.rdfType`

***

### title?

> `optional` **title**: `string`

Defined in: metadata/build/field/types/Base.d.ts:17

Human-readable title

#### Inherited from

`BaseField.title`

***

### type

> **type**: `"year"`

Defined in: metadata/build/field/types/Year.d.ts:9

Field type - discriminator property
