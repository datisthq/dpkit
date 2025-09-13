---
editUrl: false
next: false
prev: false
title: "validateDescriptor"
---

> **validateDescriptor**(`descriptor`, `options`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: [core/general/descriptor/validate.ts:10](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/general/descriptor/validate.ts#L10)

Validate a descriptor (JSON Object) against a JSON Schema
It uses Ajv for JSON Schema validation under the hood
It returns a list of errors (empty if valid)

## Parameters

### descriptor

[`Descriptor`](/reference/_dpkit/core/descriptor/)

### options

#### profile

[`Descriptor`](/reference/_dpkit/core/descriptor/)

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/_dpkit/core/metadataerror/)[]; `valid`: `boolean`; \}\>
