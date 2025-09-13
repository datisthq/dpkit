---
editUrl: false
next: false
prev: false
title: "ZenodoPlugin"
---

Defined in: [zenodo/plugin.ts:5](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/plugin.ts#L5)

## Implements

- [`Plugin`](/reference/_dpkit/core/plugin/)

## Constructors

### Constructor

> **new ZenodoPlugin**(): `ZenodoPlugin`

#### Returns

`ZenodoPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [zenodo/plugin.ts:6](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/zenodo/plugin.ts#L6)

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/_dpkit/core/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/_dpkit/core/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/_dpkit/core/resource/)[]; `sources?`: [`Source`](/reference/_dpkit/core/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

#### Implementation of

[`Plugin`](/reference/_dpkit/core/plugin/).[`loadPackage`](/reference/_dpkit/core/plugin/#loadpackage)
