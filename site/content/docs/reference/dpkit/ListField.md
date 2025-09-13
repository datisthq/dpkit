---
editUrl: false
next: false
prev: false
title: "ListField"
---

Defined in: core/build/field/types/List.d.ts:5

List field type (primitive values ordered collection)

## Extends

- `BaseField`\<[`ListConstraints`](/reference/dpkit/listconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### constraints?

> `optional` **constraints**: [`ListConstraints`](/reference/dpkit/listconstraints/)

Defined in: core/build/field/types/Base.d.ts:38

Validation constraints applied to values

#### Inherited from

`BaseField.constraints`

***

### delimiter?

> `optional` **delimiter**: `string`

Defined in: core/build/field/types/List.d.ts:13

Character used to separate values in the list

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

### itemType?

> `optional` **itemType**: `"string"` \| `"number"` \| `"boolean"` \| `"integer"` \| `"datetime"` \| `"date"` \| `"time"`

Defined in: core/build/field/types/List.d.ts:17

Type of items in the list

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

> **type**: `"list"`

Defined in: core/build/field/types/List.d.ts:9

Field type - discriminator property
