---
editUrl: false
next: false
prev: false
title: "DateField"
---

Defined in: core/build/field/types/Date.d.ts:5

Date field type

## Extends

- `BaseField`\<[`DateConstraints`](/reference/dpkit/dateconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`DateConstraints`](/reference/dpkit/dateconstraints/)

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

Defined in: core/build/field/types/Date.d.ts:16

Format of the date
- default: YYYY-MM-DD
- any: flexible date parsing (not recommended)
- Or custom strptime/strftime format string

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

> **type**: `"date"`

Defined in: core/build/field/types/Date.d.ts:9

Field type - discriminator property
