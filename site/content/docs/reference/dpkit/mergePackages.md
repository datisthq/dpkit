---
editUrl: false
next: false
prev: false
title: "mergePackages"
---

> **mergePackages**(`options`): `Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: core/build/package/merge.d.ts:5

Merges a system data package into a user data package if provided

## Parameters

### options

#### systemPackage

[`Package`](/reference/dpkit/package/)

#### userPackagePath?

`string`

## Returns

`Promise`\<\{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>
