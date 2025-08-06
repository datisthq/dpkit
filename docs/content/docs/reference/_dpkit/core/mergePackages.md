---
editUrl: false
next: false
prev: false
title: "mergePackages"
---

> **mergePackages**(`options`): `Promise`\<\{[`key`: `` `${string}:${string}` ``]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [core/package/merge.ts:7](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/merge.ts#L7)

Merges a system data package into a user data package if provided

## Parameters

### options

#### systemPackage

[`Package`](/reference/_dpkit/core/package/)

#### userPackagePath?

`string`

## Returns

`Promise`\<\{[`key`: `` `${string}:${string}` ``]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>
