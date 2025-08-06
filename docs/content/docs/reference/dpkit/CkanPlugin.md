---
editUrl: false
next: false
prev: false
title: "CkanPlugin"
---

Defined in: ckan/build/plugin.d.ts:2

## Implements

- [`Plugin`](/reference/dpkit/plugin/)

## Constructors

### Constructor

> **new CkanPlugin**(): `CkanPlugin`

#### Returns

`CkanPlugin`

## Methods

### loadPackage()

> **loadPackage**(`source`): `Promise`\<`undefined` \| \{[`x`: `` `${string}:${string}` ``]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

Defined in: ckan/build/plugin.d.ts:3

#### Parameters

##### source

`string`

#### Returns

`Promise`\<`undefined` \| \{[`x`: `` `${string}:${string}` ``]: `any`; `$schema?`: `string`; `contributors?`: [`Contributor`](/reference/dpkit/contributor/)[]; `created?`: `string`; `description?`: `string`; `homepage?`: `string`; `image?`: `string`; `keywords?`: `string`[]; `licenses?`: [`License`](/reference/dpkit/license/)[]; `name?`: `string`; `resources`: [`Resource`](/reference/dpkit/resource/)[]; `sources?`: [`Source`](/reference/dpkit/source/)[]; `title?`: `string`; `version?`: `string`; \}\>

#### Implementation of

[`Plugin`](/reference/dpkit/plugin/).[`loadPackage`](/reference/dpkit/plugin/#loadpackage)
