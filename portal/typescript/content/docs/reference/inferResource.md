---
editUrl: false
next: false
prev: false
title: "inferResource"
---

> **inferResource**(`resource`, `options?`): `Promise`\<\{ `$schema?`: `string`; `bytes?`: `number`; `data?`: `unknown`; `description?`: `string`; `dialect?`: `string` \| [`Dialect`](/reference/dialect/); `encoding?`: `string`; `format?`: `string`; `hash?`: `string`; `jsonSchema?`: `string` \| [`Descriptor`](/reference/descriptor/); `licenses?`: [`License`](/reference/license/)[]; `mediatype?`: `string`; `name`: `string`; `path?`: `string` \| `string`[]; `schema?`: `string` \| [`Schema`](/reference/schema/); `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `type?`: `"table"`; \}\>

Defined in: library/build/resource/infer.d.ts:4

## Parameters

### resource

`Partial`\<[`Resource`](/reference/resource/)\>

### options?

[`InferDialectOptions`](/reference/inferdialectoptions/) & [`InferSchemaOptions`](/reference/inferschemaoptions/)

## Returns

`Promise`\<\{ `$schema?`: `string`; `bytes?`: `number`; `data?`: `unknown`; `description?`: `string`; `dialect?`: `string` \| [`Dialect`](/reference/dialect/); `encoding?`: `string`; `format?`: `string`; `hash?`: `string`; `jsonSchema?`: `string` \| [`Descriptor`](/reference/descriptor/); `licenses?`: [`License`](/reference/license/)[]; `mediatype?`: `string`; `name`: `string`; `path?`: `string` \| `string`[]; `schema?`: `string` \| [`Schema`](/reference/schema/); `sources?`: [`Source`](/reference/source/)[]; `title?`: `string`; `type?`: `"table"`; \}\>
