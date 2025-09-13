---
editUrl: false
next: false
prev: false
title: "AnyField"
---

Defined in: [core/field/types/Any.ts:6](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Any.ts#L6)

Any field type (unspecified/mixed)

## Extends

- `BaseField`\<[`AnyConstraints`](/reference/_dpkit/core/anyconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`AnyConstraints`](/reference/_dpkit/core/anyconstraints/)

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

[`StringField`](/reference/_dpkit/core/stringfield/).[`description`](/reference/_dpkit/core/stringfield/#description)

***

### example?

> `optional` **example**: `any`

Defined in: [core/field/types/Base.ts:25](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L25)

Example value for this field

#### Inherited from

[`StringField`](/reference/_dpkit/core/stringfield/).[`example`](/reference/_dpkit/core/stringfield/#example)

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

[`StringField`](/reference/_dpkit/core/stringfield/).[`name`](/reference/_dpkit/core/stringfield/#name)

***

### rdfType?

> `optional` **rdfType**: `string`

Defined in: [core/field/types/Base.ts:30](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L30)

URI for semantic type (RDF)

#### Inherited from

[`StringField`](/reference/_dpkit/core/stringfield/).[`rdfType`](/reference/_dpkit/core/stringfield/#rdftype)

***

### title?

> `optional` **title**: `string`

Defined in: [core/field/types/Base.ts:15](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Base.ts#L15)

Human-readable title

#### Inherited from

[`StringField`](/reference/_dpkit/core/stringfield/).[`title`](/reference/_dpkit/core/stringfield/#title)

***

### type?

> `optional` **type**: `"any"`

Defined in: [core/field/types/Any.ts:10](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/field/types/Any.ts#L10)

Field type - discriminator property
