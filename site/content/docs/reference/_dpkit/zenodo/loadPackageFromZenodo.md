---
editUrl: false
next: false
prev: false
title: "loadPackageFromZenodo"
---

> **loadPackageFromZenodo**(`datasetUrl`, `options?`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [zenodo/package/load.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/package/load.ts#L11)

Load a package from a Zenodo deposit

## Parameters

### datasetUrl

`string`

### options?

#### apiKey?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object
