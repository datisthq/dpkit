---
editUrl: false
next: false
prev: false
title: "Resource"
---

Defined in: core/build/resource/Resource.d.ts:10

Data Resource interface built on top of the Data Package standard and Polars DataFrames

## See

https://datapackage.org/standard/data-resource/

## Extends

- [`Metadata`](/reference/dpkit/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### bytes?

> `optional` **bytes**: `number`

Defined in: core/build/resource/Resource.d.ts:57

Size of the file in bytes

***

### data?

> `optional` **data**: `unknown`

Defined in: core/build/resource/Resource.d.ts:25

Inline data content instead of referencing an external file
Either path or data must be provided

***

### description?

> `optional` **description**: `string`

Defined in: core/build/resource/Resource.d.ts:53

A description of the resource

***

### dialect?

> `optional` **dialect**: `string` \| [`Dialect`](/reference/dpkit/dialect/)

Defined in: core/build/resource/Resource.d.ts:75

Table dialect specification
Describes delimiters, quote characters, etc.

#### See

https://datapackage.org/standard/table-dialect/

***

### encoding?

> `optional` **encoding**: `string`

Defined in: core/build/resource/Resource.d.ts:45

Character encoding of the resource

#### Default

```ts
"utf-8"
```

***

### format?

> `optional` **format**: `string`

Defined in: core/build/resource/Resource.d.ts:35

The file format

#### Example

```ts
"csv", "json", "xlsx"
```

***

### hash?

> `optional` **hash**: `string`

Defined in: core/build/resource/Resource.d.ts:61

Hash of the resource data

***

### licenses?

> `optional` **licenses**: [`License`](/reference/dpkit/license/)[]

Defined in: core/build/resource/Resource.d.ts:69

License information

***

### mediatype?

> `optional` **mediatype**: `string`

Defined in: core/build/resource/Resource.d.ts:40

The media type of the resource

#### Example

```ts
"text/csv", "application/json"
```

***

### name

> **name**: `string`

Defined in: core/build/resource/Resource.d.ts:15

Unique resource identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### path?

> `optional` **path**: `string` \| `string`[]

Defined in: core/build/resource/Resource.d.ts:20

A reference to the data itself, can be a path URL or array of paths
Either path or data must be provided

***

### schema?

> `optional` **schema**: `string` \| [`Schema`](/reference/dpkit/schema/)

Defined in: core/build/resource/Resource.d.ts:81

Schema for the tabular data
Describes fields in the table, constraints, etc.

#### See

https://datapackage.org/standard/table-schema/

***

### sources?

> `optional` **sources**: [`Source`](/reference/dpkit/source/)[]

Defined in: core/build/resource/Resource.d.ts:65

Data sources

***

### title?

> `optional` **title**: `string`

Defined in: core/build/resource/Resource.d.ts:49

Human-readable title

***

### type?

> `optional` **type**: `"table"`

Defined in: core/build/resource/Resource.d.ts:30

The resource type

#### Example

```ts
"table"
```
