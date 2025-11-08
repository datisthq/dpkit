---
editUrl: false
next: false
prev: false
title: "Package"
---

Defined in: metadata/build/package/Package.d.ts:8

Data Package interface built on top of the Frictionless Data specification

## See

https://datapackage.org/standard/data-package/

## Extends

- `Metadata`

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: metadata/build/package/Package.d.ts:12

URL of profile (optional)

***

### contributors?

> `optional` **contributors**: [`Contributor`](/reference/contributor/)[]

Defined in: metadata/build/package/Package.d.ts:46

List of contributors

***

### created?

> `optional` **created**: `string`

Defined in: metadata/build/package/Package.d.ts:59

Create time of the package

#### Format

ISO 8601 format

***

### description?

> `optional` **description**: `string`

Defined in: metadata/build/package/Package.d.ts:29

A description of the package

***

### homepage?

> `optional` **homepage**: `string`

Defined in: metadata/build/package/Package.d.ts:33

A URL for the home page of the package

***

### image?

> `optional` **image**: `string`

Defined in: metadata/build/package/Package.d.ts:63

Package image

***

### keywords?

> `optional` **keywords**: `string`[]

Defined in: metadata/build/package/Package.d.ts:54

Keywords for the package

***

### licenses?

> `optional` **licenses**: [`License`](/reference/license/)[]

Defined in: metadata/build/package/Package.d.ts:42

License information

***

### name?

> `optional` **name**: `string`

Defined in: metadata/build/package/Package.d.ts:21

Unique package identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### resources

> **resources**: [`Resource`](/reference/resource/)[]

Defined in: metadata/build/package/Package.d.ts:16

Data resources in this package (required)

***

### sources?

> `optional` **sources**: [`Source`](/reference/source/)[]

Defined in: metadata/build/package/Package.d.ts:50

Data sources for this package

***

### title?

> `optional` **title**: `string`

Defined in: metadata/build/package/Package.d.ts:25

Human-readable title

***

### version?

> `optional` **version**: `string`

Defined in: metadata/build/package/Package.d.ts:38

Version of the package using SemVer

#### Example

```ts
"1.0.0"
```
