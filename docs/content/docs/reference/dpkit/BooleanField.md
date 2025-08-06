---
editUrl: false
next: false
prev: false
title: "BooleanField"
---

Defined in: core/build/field/types/Boolean.d.ts:5

Boolean field type

## Extends

- `BaseField`\<[`BooleanConstraints`](/reference/dpkit/booleanconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`BooleanConstraints`](/reference/dpkit/booleanconstraints/)

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

### falseValues?

> `optional` **falseValues**: `string`[]

Defined in: core/build/field/types/Boolean.d.ts:17

Values that represent false

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

### trueValues?

> `optional` **trueValues**: `string`[]

Defined in: core/build/field/types/Boolean.d.ts:13

Values that represent true

***

### type

> **type**: `"boolean"`

Defined in: core/build/field/types/Boolean.d.ts:9

Field type - discriminator property
