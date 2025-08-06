---
editUrl: false
next: false
prev: false
title: "validateDescriptor"
---

> **validateDescriptor**(`descriptor`, `options`): `Promise`\<\{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>

Defined in: core/build/general/descriptor/validate.d.ts:8

Validate a descriptor (JSON Object) against a JSON Schema
It uses Ajv for JSON Schema validation under the hood
It returns a list of errors (empty if valid)

## Parameters

### descriptor

[`Descriptor`](/reference/dpkit/descriptor/)

### options

#### profile

[`Descriptor`](/reference/dpkit/descriptor/)

## Returns

`Promise`\<\{ `errors`: [`MetadataError`](/reference/dpkit/metadataerror/)[]; `valid`: `boolean`; \}\>
