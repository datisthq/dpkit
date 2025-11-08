---
editUrl: false
next: false
prev: false
title: "loadPackageFromGithub"
---

> **loadPackageFromGithub**(`repoUrl`, `options?`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: dataset/build/plugins/github/package/load.d.ts:6

Load a package from a Github repository

## Parameters

### repoUrl

`string`

### options?

#### apiKey?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Package object
