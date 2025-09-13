---
editUrl: false
next: false
prev: false
title: "validateResource"
---

> **validateResource**(`pathOrDescriptorOrResource`, `options?`): `Promise`\<\{ `errors`: [`FileError`](/reference/dpkit/fileerror/)[]; `valid`: `boolean`; \} \| \{ `errors`: [`TableError`](/reference/dpkit/tableerror/)[]; `valid`: `boolean`; \} \| \{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [dpkit/resource/validate.ts:8](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/dpkit/resource/validate.ts#L8)

## Parameters

### pathOrDescriptorOrResource

`string` | `Partial`\<[`Resource`](/reference/dpkit/resource/)\> | [`Descriptor`](/reference/dpkit/descriptor/)

### options?

#### basepath?

`string`

## Returns

`Promise`\<\{ `errors`: [`FileError`](/reference/dpkit/fileerror/)[]; `valid`: `boolean`; \} \| \{ `errors`: [`TableError`](/reference/dpkit/tableerror/)[]; `valid`: `boolean`; \} \| \{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>
