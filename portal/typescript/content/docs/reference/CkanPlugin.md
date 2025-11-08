---
editUrl: false
next: false
prev: false
title: "CkanPlugin"
---

Defined in: dataset/build/plugins/ckan/plugin.d.ts:2

## Implements

- [`DatasetPlugin`](/reference/datasetplugin/)

## Constructors

### Constructor

> **new CkanPlugin**(): `CkanPlugin`

#### Returns

`CkanPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: dataset/build/plugins/ckan/plugin.d.ts:3

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/resource/)[]; `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

#### Implementation of

[`DatasetPlugin`](/reference/datasetplugin/).[`loadPackage`](/reference/datasetplugin/#loadpackage)
