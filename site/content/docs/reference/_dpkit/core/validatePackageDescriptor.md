---
editUrl: false
next: false
prev: false
title: "validatePackageDescriptor"
---

> **validatePackageDescriptor**(`source`, `options?`): `Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/_dpkit/core/package/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [core/package/validate.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/package/validate.ts#L11)

Validate a Package descriptor (JSON Object) against its profile

## Parameters

### source

[`Package`](/reference/_dpkit/core/package/) | [`Descriptor`](/reference/_dpkit/core/descriptor/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/_dpkit/core/package/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>
