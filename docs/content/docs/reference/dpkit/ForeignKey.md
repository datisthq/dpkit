---
editUrl: false
next: false
prev: false
title: "ForeignKey"
---

Defined in: core/build/schema/ForeignKey.d.ts:5

Foreign key definition for Table Schema
Based on the specification at https://datapackage.org/standard/table-schema/#foreign-keys

## Properties

### fields

> **fields**: `string`[]

Defined in: core/build/schema/ForeignKey.d.ts:9

Source field(s) in this schema

***

### reference

> **reference**: `object`

Defined in: core/build/schema/ForeignKey.d.ts:13

Reference to fields in another resource

#### fields

> **fields**: `string`[]

Target field(s) in the referenced resource

#### resource?

> `optional` **resource**: `string`

Target resource name (optional)
