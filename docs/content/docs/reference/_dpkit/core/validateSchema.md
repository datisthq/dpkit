---
editUrl: false
next: false
prev: false
title: "validateSchema"
---

> **validateSchema**(`descriptorOrSchema`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `schema`: `undefined` \| [`Schema`](/reference/_dpkit/core/schema/); `valid`: `boolean`; \}\>

Defined in: [core/schema/validate.ts:11](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/schema/validate.ts#L11)

Validate a Schema descriptor (JSON Object) against its profile

## Parameters

### descriptorOrSchema

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Schema`](/reference/_dpkit/core/schema/)

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `schema`: `undefined` \| [`Schema`](/reference/_dpkit/core/schema/); `valid`: `boolean`; \}\>
