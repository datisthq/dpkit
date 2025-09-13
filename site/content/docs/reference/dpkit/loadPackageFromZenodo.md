---
editUrl: false
next: false
prev: false
title: "loadPackageFromZenodo"
---

> **loadPackageFromZenodo**(`datasetUrl`, `options?`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: zenodo/build/package/load.d.ts:6

Load a package from a Zenodo deposit

## Parameters

### datasetUrl

`string`

### options?

#### apiKey?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object
