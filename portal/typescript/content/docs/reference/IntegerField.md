---
editUrl: false
next: false
prev: false
title: "IntegerField"
---

Defined in: metadata/build/field/types/Integer.d.ts:5

Integer field type

## Extends

- `BaseField`\<[`IntegerConstraints`](/reference/integerconstraints/)\>

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### bareNumber?

> `optional` **bareNumber**: `boolean`

Defined in: metadata/build/field/types/Integer.d.ts:17

Whether number is presented without currency symbols or percent signs

***

### categories?

> `optional` **categories**: `number`[] \| `object`[]

Defined in: metadata/build/field/types/Integer.d.ts:22

Categories for enum values
Can be an array of values or an array of {value, label} objects

***

### categoriesOrdered?

> `optional` **categoriesOrdered**: `boolean`

Defined in: metadata/build/field/types/Integer.d.ts:29

Whether categories should be considered to have a natural order

***

### constraints?

> `optional` **constraints**: [`IntegerConstraints`](/reference/integerconstraints/)

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

### groupChar?

> `optional` **groupChar**: `string`

Defined in: metadata/build/field/types/Integer.d.ts:13

Character used as thousands separator

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

> **type**: `"integer"`

Defined in: metadata/build/field/types/Integer.d.ts:9

Field type - discriminator property
