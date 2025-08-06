---
editUrl: false
next: false
prev: false
title: "Package"
---

Defined in: [core/package/Package.ts:9](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L9)

Data Package interface built on top of the Frictionless Data specification

## See

https://datapackage.org/standard/data-package/

## Extends

- [`Metadata`](/reference/_dpkit/core/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: [core/package/Package.ts:24](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L24)

Package schema URL for validation

***

### contributors?

> `optional` **contributors**: [`Contributor`](/reference/_dpkit/core/contributor/)[]

Defined in: [core/package/Package.ts:55](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L55)

List of contributors

***

### created?

> `optional` **created**: `string`

Defined in: [core/package/Package.ts:71](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L71)

Create time of the package

#### Format

ISO 8601 format

***

### description?

> `optional` **description**: `string`

Defined in: [core/package/Package.ts:34](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L34)

A description of the package

***

### homepage?

> `optional` **homepage**: `string`

Defined in: [core/package/Package.ts:39](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L39)

A URL for the home page of the package

***

### image?

> `optional` **image**: `string`

Defined in: [core/package/Package.ts:76](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L76)

Package image

***

### keywords?

> `optional` **keywords**: `string`[]

Defined in: [core/package/Package.ts:65](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L65)

Keywords for the package

***

### licenses?

> `optional` **licenses**: [`License`](/reference/_dpkit/core/license/)[]

Defined in: [core/package/Package.ts:50](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L50)

License information

***

### name?

> `optional` **name**: `string`

Defined in: [core/package/Package.ts:19](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L19)

Unique package identifier
Should use lowercase alphanumeric characters, periods, hyphens, and underscores

***

### resources

> **resources**: [`Resource`](/reference/_dpkit/core/resource/)[]

Defined in: [core/package/Package.ts:13](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L13)

Data resources in this package (required)

***

### sources?

> `optional` **sources**: [`Source`](/reference/_dpkit/core/source/)[]

Defined in: [core/package/Package.ts:60](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L60)

Data sources for this package

***

### title?

> `optional` **title**: `string`

Defined in: [core/package/Package.ts:29](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L29)

Human-readable title

***

### version?

> `optional` **version**: `string`

Defined in: [core/package/Package.ts:45](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/Package.ts#L45)

Version of the package using SemVer

#### Example

```ts
"1.0.0"
```
