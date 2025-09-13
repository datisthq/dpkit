---
editUrl: false
next: false
prev: false
title: "loadPackageFromGithub"
---

> **loadPackageFromGithub**(`repoUrl`, `options?`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [github/package/load.ts:12](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/github/package/load.ts#L12)

Load a package from a Github repository

## Parameters

### repoUrl

`string`

### options?

#### apiKey?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object
