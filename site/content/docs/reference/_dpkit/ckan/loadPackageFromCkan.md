---
editUrl: false
next: false
prev: false
title: "loadPackageFromCkan"
---

> **loadPackageFromCkan**(`datasetUrl`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [ckan/package/load.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/ckan/package/load.ts#L11)

Load a package from a CKAN instance

## Parameters

### datasetUrl

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object and cleanup function
