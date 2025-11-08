---
editUrl: false
next: false
prev: false
title: "Schema"
---

Defined in: metadata/build/schema/Schema.d.ts:8

Table Schema definition
Based on the specification at https://datapackage.org/standard/table-schema/

## Extends

- `Metadata`

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: metadata/build/schema/Schema.d.ts:12

URL of profile (optional)

***

### description?

> `optional` **description**: `string`

Defined in: metadata/build/schema/Schema.d.ts:24

Description of schema (optional)

***

### fields

> **fields**: [`Field`](/reference/field/)[]

Defined in: metadata/build/schema/Schema.d.ts:28

Fields in this schema (required)

***

### fieldsMatch?

> `optional` **fieldsMatch**: `"exact"` \| `"equal"` \| `"subset"` \| `"superset"` \| `"partial"`

Defined in: metadata/build/schema/Schema.d.ts:33

Field matching rule (optional)
Default: "exact"

***

### foreignKeys?

> `optional` **foreignKeys**: `ForeignKey`[]

Defined in: metadata/build/schema/Schema.d.ts:55

Foreign key relationships (optional)

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: metadata/build/schema/Schema.d.ts:40

Values representing missing data (optional)
Default: [""]
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

***

### name?

> `optional` **name**: `string`

Defined in: metadata/build/schema/Schema.d.ts:16

Name of schema (optional)

***

### primaryKey?

> `optional` **primaryKey**: `string`[]

Defined in: metadata/build/schema/Schema.d.ts:47

Fields uniquely identifying each row (optional)

***

### title?

> `optional` **title**: `string`

Defined in: metadata/build/schema/Schema.d.ts:20

Title of schema (optional)

***

### uniqueKeys?

> `optional` **uniqueKeys**: `string`[][]

Defined in: metadata/build/schema/Schema.d.ts:51

Field combinations that must be unique (optional)
