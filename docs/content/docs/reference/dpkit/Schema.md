---
editUrl: false
next: false
prev: false
title: "Schema"
---

Defined in: core/build/schema/Schema.d.ts:8

Table Schema definition
Based on the specification at https://datapackage.org/standard/table-schema/

## Extends

- [`Metadata`](/reference/dpkit/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: core/build/schema/Schema.d.ts:16

URL of schema (optional)

***

### fields

> **fields**: [`Field`](/reference/dpkit/field/)[]

Defined in: core/build/schema/Schema.d.ts:12

Fields in this schema (required)

***

### fieldsMatch?

> `optional` **fieldsMatch**: `"exact"` \| `"equal"` \| `"subset"` \| `"superset"` \| `"partial"`

Defined in: core/build/schema/Schema.d.ts:21

Field matching rule (optional)
Default: "exact"

***

### foreignKeys?

> `optional` **foreignKeys**: [`ForeignKey`](/reference/dpkit/foreignkey/)[]

Defined in: core/build/schema/Schema.d.ts:43

Foreign key relationships (optional)

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: core/build/schema/Schema.d.ts:28

Values representing missing data (optional)
Default: [""]
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

***

### primaryKey?

> `optional` **primaryKey**: `string`[]

Defined in: core/build/schema/Schema.d.ts:35

Fields uniquely identifying each row (optional)

***

### uniqueKeys?

> `optional` **uniqueKeys**: `string`[][]

Defined in: core/build/schema/Schema.d.ts:39

Field combinations that must be unique (optional)
