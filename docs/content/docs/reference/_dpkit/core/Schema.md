---
editUrl: false
next: false
prev: false
title: "Schema"
---

Defined in: [core/schema/Schema.ts:9](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L9)

Table Schema definition
Based on the specification at https://datapackage.org/standard/table-schema/

## Extends

- [`Metadata`](/reference/_dpkit/core/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: [core/schema/Schema.ts:18](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L18)

URL of schema (optional)

***

### fields

> **fields**: [`Field`](/reference/_dpkit/core/field/)[]

Defined in: [core/schema/Schema.ts:13](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L13)

Fields in this schema (required)

***

### fieldsMatch?

> `optional` **fieldsMatch**: `"exact"` \| `"equal"` \| `"subset"` \| `"superset"` \| `"partial"`

Defined in: [core/schema/Schema.ts:24](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L24)

Field matching rule (optional)
Default: "exact"

***

### foreignKeys?

> `optional` **foreignKeys**: [`ForeignKey`](/reference/_dpkit/core/foreignkey/)[]

Defined in: [core/schema/Schema.ts:47](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L47)

Foreign key relationships (optional)

***

### missingValues?

> `optional` **missingValues**: (`string` \| \{ `label`: `string`; `value`: `string`; \})[]

Defined in: [core/schema/Schema.ts:32](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L32)

Values representing missing data (optional)
Default: [""]
Can be a simple array of strings or an array of {value, label} objects
where label provides context for why the data is missing

***

### primaryKey?

> `optional` **primaryKey**: `string`[]

Defined in: [core/schema/Schema.ts:37](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L37)

Fields uniquely identifying each row (optional)

***

### uniqueKeys?

> `optional` **uniqueKeys**: `string`[][]

Defined in: [core/schema/Schema.ts:42](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/Schema.ts#L42)

Field combinations that must be unique (optional)
