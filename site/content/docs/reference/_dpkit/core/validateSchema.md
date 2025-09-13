---
editUrl: false
next: false
prev: false
title: "validateSchema"
---

> **validateSchema**(`source`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `schema`: `undefined` \| [`Schema`](/reference/_dpkit/core/schema/); `valid`: `boolean`; \}\>

Defined in: [core/schema/validate.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/schema/validate.ts#L11)

Validate a Schema descriptor (JSON Object) against its profile

## Parameters

### source

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Schema`](/reference/_dpkit/core/schema/)

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `schema`: `undefined` \| [`Schema`](/reference/_dpkit/core/schema/); `valid`: `boolean`; \}\>
