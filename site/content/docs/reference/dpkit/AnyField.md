---
editUrl: false
next: false
prev: false
title: "AnyField"
---

Defined in: core/build/field/types/Any.d.ts:5

Any field type (unspecified/mixed)

## Extends

- `BaseField`\<[`AnyConstraints`](/reference/dpkit/anyconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`AnyConstraints`](/reference/dpkit/anyconstraints/)

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

[`StringField`](/reference/dpkit/stringfield/).[`description`](/reference/dpkit/stringfield/#description)

***

### example?

> `optional` **example**: `any`

Defined in: core/build/field/types/Base.d.ts:21

Example value for this field

#### Inherited from

[`StringField`](/reference/dpkit/stringfield/).[`example`](/reference/dpkit/stringfield/#example)

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

[`StringField`](/reference/dpkit/stringfield/).[`name`](/reference/dpkit/stringfield/#name)

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: core/build/field/types/Base.d.ts:25

URI for semantic type (RDF)

#### Inherited from

[`StringField`](/reference/dpkit/stringfield/).[`rdfType`](/reference/dpkit/stringfield/#rdftype)

***

### title?

> `optional` **title**: `string`

Defined in: core/build/field/types/Base.d.ts:13

Human-readable title

#### Inherited from

[`StringField`](/reference/dpkit/stringfield/).[`title`](/reference/dpkit/stringfield/#title)

***

### type?

> `optional` **type**: `"any"`

Defined in: core/build/field/types/Any.d.ts:9

Field type - discriminator property
