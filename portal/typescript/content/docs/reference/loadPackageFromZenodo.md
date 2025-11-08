---
editUrl: false
next: false
prev: false
title: "loadPackageFromZenodo"
---

> **loadPackageFromZenodo**(`datasetUrl`, `options?`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: dataset/build/plugins/zenodo/package/load.d.ts:6

Load a package from a Zenodo deposit

## Parameters

### datasetUrl

`string`

### options?

#### apiKey?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object
