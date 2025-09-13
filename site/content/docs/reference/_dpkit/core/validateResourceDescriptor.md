---
editUrl: false
next: false
prev: false
title: "validateResourceDescriptor"
---

> **validateResourceDescriptor**(`source`, `options?`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/_dpkit/core/resource/); `valid`: `boolean`; \}\>

Defined in: [core/resource/validate.ts:14](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/resource/validate.ts#L14)

Validate a Resource descriptor (JSON Object) against its profile

## Parameters

### source

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Resource`](/reference/_dpkit/core/resource/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/_dpkit/core/resource/); `valid`: `boolean`; \}\>
