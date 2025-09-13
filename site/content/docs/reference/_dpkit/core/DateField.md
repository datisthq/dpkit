---
editUrl: false
next: false
prev: false
title: "DateField"
---

Defined in: [core/field/types/Date.ts:6](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L6)

Date field type

## Extends

- `BaseField`\<[`DateConstraints`](/reference/_dpkit/core/dateconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`DateConstraints`](/reference/_dpkit/core/dateconstraints/)

Defined in: [core/field/types/Base.ts:42](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L42)

Validation constraints applied to values

#### Inherited from

`BaseField.constraints`

***

### description?

> `optional` **description**: `string`

Defined in: [core/field/types/Base.ts:20](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L20)

Human-readable description

#### Inherited from

`BaseField.description`

***

### example?

> `optional` **example**: `any`

Defined in: [core/field/types/Base.ts:25](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L25)

Example value for this field

#### Inherited from

`BaseField.example`

***

### format?

> `optional` **format**: `string`

Defined in: [core/field/types/Date.ts:18](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L18)

Format of the date
- default: YYYY-MM-DD
- any: flexible date parsing (not recommended)
- Or custom strptime/strftime format string

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: [core/field/types/Base.ts:37](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L37)

Values representing missing data for this field
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

#### Inherited from

`BaseField.missingValues`

***

### name

> **name**: `string`

Defined in: [core/field/types/Base.ts:10](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L10)

Name of the field matching the column name

#### Inherited from

`BaseField.name`

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: [core/field/types/Base.ts:30](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L30)

URI for semantic type (RDF)

#### Inherited from

`BaseField.rdfType`

***

### title?

> `optional` **title**: `string`

Defined in: [core/field/types/Base.ts:15](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L15)

Human-readable title

#### Inherited from

`BaseField.title`

***

### type

> **type**: `"date"`

Defined in: [core/field/types/Date.ts:10](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Date.ts#L10)

Field type - discriminator property
