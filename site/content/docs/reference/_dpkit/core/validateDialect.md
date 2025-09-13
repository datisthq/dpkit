---
editUrl: false
next: false
prev: false
title: "validateDialect"
---

> **validateDialect**(`source`): `Promise`\<\{ `dialect`: `undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [core/dialect/validate.ts:11](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/dialect/validate.ts#L11)

Validate a Dialect descriptor (JSON Object) against its profile

## Parameters

### source

[`Descriptor`](/reference/_dpkit/core/descriptor/) | [`Dialect`](/reference/_dpkit/core/dialect/)

## Returns

`Promise`\<\{ `dialect`: `undefined` \| [`Dialect`](/reference/_dpkit/core/dialect/); `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>
