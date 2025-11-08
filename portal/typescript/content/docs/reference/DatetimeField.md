---
editUrl: false
next: false
prev: false
title: "DatetimeField"
---

Defined in: metadata/build/field/types/Datetime.d.ts:5

Datetime field type

## Extends

- `BaseField`\<[`DatetimeConstraints`](/reference/datetimeconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`DatetimeConstraints`](/reference/datetimeconstraints/)

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

Defined in: metadata/build/field/types/Datetime.d.ts:16

Format of the datetime
- default: ISO8601 format
- any: flexible datetime parsing (not recommended)
- Or custom strptime/strftime format string

#### Overrides

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

> **type**: `"datetime"`

Defined in: metadata/build/field/types/Datetime.d.ts:9

Field type - discriminator property
