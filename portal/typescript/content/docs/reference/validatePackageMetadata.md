---
editUrl: false
next: false
prev: false
title: "validatePackageMetadata"
---

> **validatePackageMetadata**(`source`, `options?`): `Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/package/); `errors`: [`MetadataError`](/reference/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: metadata/build/package/validate.d.ts:6

Validate a Package descriptor (JSON Object) against its profile

## Parameters

### source

`string` | [`Descriptor`](/reference/descriptor/) | [`Package`](/reference/package/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/package/); `errors`: [`MetadataError`](/reference/metadataerror/)[]; `valid`: `boolean`; \}\>
