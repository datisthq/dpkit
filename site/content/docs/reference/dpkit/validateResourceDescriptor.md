---
editUrl: false
next: false
prev: false
title: "validateResourceDescriptor"
---

> **validateResourceDescriptor**(`source`, `options?`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/dpkit/resource/); `valid`: `boolean`; \}\>

Defined in: core/build/resource/validate.d.ts:6

Validate a Resource descriptor (JSON Object) against its profile

## Parameters

### source

[`Resource`](/reference/dpkit/resource/) | [`Descriptor`](/reference/dpkit/descriptor/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `resource`: `undefined` \| [`Resource`](/reference/dpkit/resource/); `valid`: `boolean`; \}\>
