---
editUrl: false
next: false
prev: false
title: "Resource"
---

Defined in: metadata/build/resource/Resource.d.ts:11

Data Resource interface built on top of the Data Package standard and Polars DataFrames

## See

https://datapackage.org/standard/data-resource/

## Extends

- `Metadata`

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: metadata/build/resource/Resource.d.ts:15

JSON schema profile URL for validation

***

### bytes?

> `optional` **bytes**: `number`

Defined in: metadata/build/resource/Resource.d.ts:62

Size of the file in bytes

***

### data?

> `optional` **data**: `unknown`

Defined in: metadata/build/resource/Resource.d.ts:30

Inline data content instead of referencing an external file
Either path or data must be provided

***

### description?

> `optional` **description**: `string`

Defined in: metadata/build/resource/Resource.d.ts:58

A description of the resource

***

### dialect?

> `optional` **dialect**: `string` \| [`Dialect`](/reference/dialect/)

Defined in: metadata/build/resource/Resource.d.ts:80

Table dialect specification
Describes delimiters, quote characters, etc.

#### See

https://datapackage.org/standard/table-dialect/

***

### encoding?

> `optional` **encoding**: `string`

Defined in: metadata/build/resource/Resource.d.ts:50

Character encoding of the resource

#### Default

```ts
"utf-8"
```

***

### format?

> `optional` **format**: `string`

Defined in: metadata/build/resource/Resource.d.ts:40

The file format

#### Example

```ts
"csv", "json", "xlsx"
```

***

### hash?

> `optional` **hash**: `string`

Defined in: metadata/build/resource/Resource.d.ts:66

Hash of the resource data

***

### jsonSchema?

> `optional` **jsonSchema**: `string` \| [`Descriptor`](/reference/descriptor/)

Defined in: metadata/build/resource/Resource.d.ts:92

Schema for the json data
Describes fields in the json, constraints, etc.

#### See

https://json-schema.org/

***

### licenses?

> `optional` **licenses**: [`License`](/reference/license/)[]

Defined in: metadata/build/resource/Resource.d.ts:74

License information

***

### mediatype?

> `optional` **mediatype**: `string`

Defined in: metadata/build/resource/Resource.d.ts:45

The media type of the resource

#### Example

```ts
"text/csv", "application/json"
```

***

### name

> **name**: `string`

Defined in: metadata/build/resource/Resource.d.ts:20

Unique resource identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### path?

> `optional` **path**: `string` \| `string`[]

Defined in: metadata/build/resource/Resource.d.ts:25

A reference to the data itself, can be a path URL or array of paths
Either path or data must be provided

***

### schema?

> `optional` **schema**: `string` \| [`Schema`](/reference/schema/)

Defined in: metadata/build/resource/Resource.d.ts:86

Schema for the tabular data
Describes fields in the table, constraints, etc.

#### See

https://datapackage.org/standard/table-schema/

***

### sources?

> `optional` **sources**: [`Source`](/reference/source/)[]

Defined in: metadata/build/resource/Resource.d.ts:70

Data sources

***

### title?

> `optional` **title**: `string`

Defined in: metadata/build/resource/Resource.d.ts:54

Human-readable title

***

### type?

> `optional` **type**: `"table"`

Defined in: metadata/build/resource/Resource.d.ts:35

The resource type

#### Example

```ts
"table"
```
