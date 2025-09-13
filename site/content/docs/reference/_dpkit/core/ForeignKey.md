---
editUrl: false
next: false
prev: false
title: "ForeignKey"
---

Defined in: [core/schema/ForeignKey.ts:5](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/schema/ForeignKey.ts#L5)

Foreign key definition for Table Schema
Based on the specification at https://datapackage.org/standard/table-schema/#foreign-keys

## Properties

### fields

> **fields**: `string`[]

Defined in: [core/schema/ForeignKey.ts:9](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/schema/ForeignKey.ts#L9)

Source field(s) in this schema

***

### reference

> **reference**: `object`

Defined in: [core/schema/ForeignKey.ts:14](https://github.com/datisthq/dpkit/blob/5891634de8175d14853313e208ffbae144fd78eb/core/schema/ForeignKey.ts#L14)

Reference to fields in another resource

#### fields

> **fields**: `string`[]

Target field(s) in the referenced resource

#### resource?

> `optional` **resource**: `string`

Target resource name (optional)
