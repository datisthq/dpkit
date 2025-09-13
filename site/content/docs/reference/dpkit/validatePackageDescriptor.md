---
editUrl: false
next: false
prev: false
title: "validatePackageDescriptor"
---

> **validatePackageDescriptor**(`source`, `options?`): `Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/dpkit/package/); `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: core/build/package/validate.d.ts:6

Validate a Package descriptor (JSON Object) against its profile

## Parameters

### source

[`Package`](/reference/dpkit/package/) | [`Descriptor`](/reference/dpkit/descriptor/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/dpkit/package/); `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>
