---
editUrl: false
next: false
prev: false
title: "Resource"
---

Defined in: [core/resource/Resource.ts:11](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L11)

Data Resource interface built on top of the Data Package standard and Polars DataFrames

## See

https://datapackage.org/standard/data-resource/

## Extends

- [`Metadata`](/reference/_dpkit/core/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### bytes?

> `optional` **bytes**: `number`

Defined in: [core/resource/Resource.ts:67](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L67)

Size of the file in bytes

***

### data?

> `optional` **data**: `unknown`

Defined in: [core/resource/Resource.ts:28](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L28)

Inline data content instead of referencing an external file
Either path or data must be provided

***

### description?

> `optional` **description**: `string`

Defined in: [core/resource/Resource.ts:62](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L62)

A description of the resource

***

### dialect?

> `optional` **dialect**: `string` \| [`Dialect`](/reference/_dpkit/core/dialect/)

Defined in: [core/resource/Resource.ts:89](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L89)

Table dialect specification
Describes delimiters, quote characters, etc.

#### See

https://datapackage.org/standard/table-dialect/

***

### encoding?

> `optional` **encoding**: `string`

Defined in: [core/resource/Resource.ts:52](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L52)

Character encoding of the resource

#### Default

```ts
"utf-8"
```

***

### format?

> `optional` **format**: `string`

Defined in: [core/resource/Resource.ts:40](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L40)

The file format

#### Example

```ts
"csv", "json", "xlsx"
```

***

### hash?

> `optional` **hash**: `string`

Defined in: [core/resource/Resource.ts:72](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L72)

Hash of the resource data

***

### licenses?

> `optional` **licenses**: [`License`](/reference/_dpkit/core/license/)[]

Defined in: [core/resource/Resource.ts:82](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L82)

License information

***

### mediatype?

> `optional` **mediatype**: `string`

Defined in: [core/resource/Resource.ts:46](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L46)

The media type of the resource

#### Example

```ts
"text/csv", "application/json"
```

***

### name

> **name**: `string`

Defined in: [core/resource/Resource.ts:16](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L16)

Unique resource identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### path?

> `optional` **path**: `string` \| `string`[]

Defined in: [core/resource/Resource.ts:22](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L22)

A reference to the data itself, can be a path URL or array of paths
Either path or data must be provided

***

### schema?

> `optional` **schema**: `string` \| [`Schema`](/reference/_dpkit/core/schema/)

Defined in: [core/resource/Resource.ts:96](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L96)

Schema for the tabular data
Describes fields in the table, constraints, etc.

#### See

https://datapackage.org/standard/table-schema/

***

### sources?

> `optional` **sources**: [`Source`](/reference/_dpkit/core/source/)[]

Defined in: [core/resource/Resource.ts:77](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L77)

Data sources

***

### title?

> `optional` **title**: `string`

Defined in: [core/resource/Resource.ts:57](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L57)

Human-readable title

***

### type?

> `optional` **type**: `"table"`

Defined in: [core/resource/Resource.ts:34](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/Resource.ts#L34)

The resource type

#### Example

```ts
"table"
```
