---
editUrl: false
next: false
prev: false
title: "validateDialect"
---

> **validateDialect**(`descriptorOrDialect`): `Promise`\<\{ `dialect`: `undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [core/dialect/validate.ts:11](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/validate.ts#L11)

Validate a Dialect descriptor (JSON Object) against its profile

## Parameters

### descriptorOrDialect

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Dialect`](/reference/_dpkit/core/dialect/)

## Returns

`Promise`\<\{ `dialect`: `undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>
