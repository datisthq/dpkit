---
editUrl: false
next: false
prev: false
title: "Package"
---

Defined in: core/build/package/Package.d.ts:8

Data Package interface built on top of the Frictionless Data specification

## See

https://datapackage.org/standard/data-package/

## Extends

- [`Metadata`](/reference/dpkit/metadata/)

## Extended by

- [`CamtrapPackage`](/reference/dpkit/camtrappackage/)
- [`CamtrapPackage`](/reference/_dpkit/camtrap/camtrappackage/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: core/build/package/Package.d.ts:21

Package schema URL for validation

***

### contributors?

> `optional` **contributors**: [`Contributor`](/reference/dpkit/contributor/)[]

Defined in: core/build/package/Package.d.ts:46

List of contributors

***

### created?

> `optional` **created**: `string`

Defined in: core/build/package/Package.d.ts:59

Create time of the package

#### Format

ISO 8601 format

***

### description?

> `optional` **description**: `string`

Defined in: core/build/package/Package.d.ts:29

A description of the package

***

### homepage?

> `optional` **homepage**: `string`

Defined in: core/build/package/Package.d.ts:33

A URL for the home page of the package

***

### image?

> `optional` **image**: `string`

Defined in: core/build/package/Package.d.ts:63

Package image

***

### keywords?

> `optional` **keywords**: `string`[]

Defined in: core/build/package/Package.d.ts:54

Keywords for the package

***

### licenses?

> `optional` **licenses**: [`License`](/reference/dpkit/license/)[]

Defined in: core/build/package/Package.d.ts:42

License information

***

### name?

> `optional` **name**: `string`

Defined in: core/build/package/Package.d.ts:17

Unique package identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### resources

> **resources**: [`Resource`](/reference/dpkit/resource/)[]

Defined in: core/build/package/Package.d.ts:12

Data resources in this package (required)

***

### sources?

> `optional` **sources**: [`Source`](/reference/dpkit/source/)[]

Defined in: core/build/package/Package.d.ts:50

Data sources for this package

***

### title?

> `optional` **title**: `string`

Defined in: core/build/package/Package.d.ts:25

Human-readable title

***

### version?

> `optional` **version**: `string`

Defined in: core/build/package/Package.d.ts:38

Version of the package using SemVer

#### Example

```ts
"1.0.0"
```
