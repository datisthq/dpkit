---
editUrl: false
next: false
prev: false
title: "AnyField"
---

Defined in: metadata/build/field/types/Any.d.ts:5

Any field type (unspecified/mixed)

## Extends

- `BaseField`\<[`AnyConstraints`](/reference/anyconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`AnyConstraints`](/reference/anyconstraints/)

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

[`ArrayField`](/reference/arrayfield/).[`description`](/reference/arrayfield/#description)

***

### example?

> `optional` **example**: `any`

Defined in: metadata/build/field/types/Base.d.ts:25

Example value for this field

#### Inherited from

[`ArrayField`](/reference/arrayfield/).[`example`](/reference/arrayfield/#example)

***

### examples?

> `optional` **examples**: `any`[]

Defined in: metadata/build/field/types/Base.d.ts:29

Examples for this field

#### Inherited from

[`ArrayField`](/reference/arrayfield/).[`examples`](/reference/arrayfield/#examples)

***

### format?

> `optional` **format**: `string`

Defined in: metadata/build/field/types/Base.d.ts:13

Field format -- optional addition to the type

#### Inherited from

[`ArrayField`](/reference/arrayfield/).[`format`](/reference/arrayfield/#format)

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

[`ArrayField`](/reference/arrayfield/).[`name`](/reference/arrayfield/#name)

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: metadata/build/field/types/Base.d.ts:33

URI for semantic type (RDF)

#### Inherited from

[`ArrayField`](/reference/arrayfield/).[`rdfType`](/reference/arrayfield/#rdftype)

***

### title?

> `optional` **title**: `string`

Defined in: metadata/build/field/types/Base.d.ts:17

Human-readable title

#### Inherited from

[`ArrayField`](/reference/arrayfield/).[`title`](/reference/arrayfield/#title)

***

### type?

> `optional` **type**: `"any"`

Defined in: metadata/build/field/types/Any.d.ts:9

Field type - discriminator property
