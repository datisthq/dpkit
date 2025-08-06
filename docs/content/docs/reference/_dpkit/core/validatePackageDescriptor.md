---
editUrl: false
next: false
prev: false
title: "validatePackageDescriptor"
---

> **validatePackageDescriptor**(`descriptorOrPackage`, `options?`): `Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/_dpkit/core/package/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [core/package/validate.ts:11](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/package/validate.ts#L11)

Validate a Package descriptor (JSON Object) against its profile

## Parameters

### descriptorOrPackage

[`Package`](/reference/_dpkit/core/package/) | [`Descriptor`](/reference/_dpkit/core/descriptor/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `dataPackage`: `undefined` \| [`Package`](/reference/_dpkit/core/package/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>
