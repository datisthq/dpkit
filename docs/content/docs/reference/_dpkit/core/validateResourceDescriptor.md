---
editUrl: false
next: false
prev: false
title: "validateResourceDescriptor"
---

> **validateResourceDescriptor**(`descriptorOrResource`, `options?`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/_dpkit/core/resource/); `valid`: `boolean`; \}\>

Defined in: [core/resource/validate.ts:14](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/resource/validate.ts#L14)

Validate a Resource descriptor (JSON Object) against its profile

## Parameters

### descriptorOrResource

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Resource`](/reference/_dpkit/core/resource/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/_dpkit/core/resource/); `valid`: `boolean`; \}\>
