---
editUrl: false
next: false
prev: false
title: "CkanPlugin"
---

Defined in: [ckan/plugin.ts:5](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/ckan/plugin.ts#L5)

## Implements

- [`Plugin`](/reference/dpkit/plugin/)

## Constructors

### Constructor

> **new CkanPlugin**(): `CkanPlugin`

#### Returns

`CkanPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: [ckan/plugin.ts:6](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/ckan/plugin.ts#L6)

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| \{\[`x`: `` `${string}:${string}` ``\]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

#### Implementation of

[`Plugin`](/reference/dpkit/plugin/).[`loadPackage`](/reference/dpkit/plugin/#loadpackage)
