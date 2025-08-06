---
editUrl: false
next: false
prev: false
title: "normalizeZenodoResource"
---

> **normalizeZenodoResource**(`zenodoResource`): `object`

Defined in: [zenodo/resource/process/normalize.ts:9](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/zenodo/resource/process/normalize.ts#L9)

Normalizes a Zenodo file to Frictionless Data resource format

## Parameters

### zenodoResource

[`ZenodoResource`](/reference/_dpkit/zenodo/zenodoresource/)

## Returns

`object`

Normalized Resource object

### bytes

> **bytes**: `number` = `zenodoResource.size`

### format

> **format**: `undefined` \| `string`

### hash

> **hash**: `string` = `zenodoResource.checksum`

### name

> **name**: `string`

### path

> **path**: `string`

### zenodo:key

> **zenodo:key**: `string` = `zenodoResource.key`

### zenodo:url

> **zenodo:url**: `string` = `path`
