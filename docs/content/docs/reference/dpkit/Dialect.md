---
editUrl: false
next: false
prev: false
title: "Dialect"
---

Defined in: core/build/dialect/Dialect.d.ts:7

Descriptor that describes the structure of tabular data, such as delimiters,
headers, and other features. Following the Data Package standard:
https://datapackage.org/standard/table-dialect/

## Extends

- [`Metadata`](/reference/dpkit/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: core/build/dialect/Dialect.d.ts:15

JSON schema profile URL for validation

***

### commentChar?

> `optional` **commentChar**: `string`

Defined in: core/build/dialect/Dialect.d.ts:35

Character sequence denoting the start of a comment line

***

### commentRows?

> `optional` **commentRows**: `number`[]

Defined in: core/build/dialect/Dialect.d.ts:31

Specific rows to be excluded from the data (zero-based)

***

### delimiter?

> `optional` **delimiter**: `string`

Defined in: core/build/dialect/Dialect.d.ts:39

The character used to separate fields in the data

***

### doubleQuote?

> `optional` **doubleQuote**: `boolean`

Defined in: core/build/dialect/Dialect.d.ts:51

Controls whether a sequence of two quote characters represents a single quote

***

### escapeChar?

> `optional` **escapeChar**: `string`

Defined in: core/build/dialect/Dialect.d.ts:55

Character used to escape the delimiter or quote characters

***

### header?

> `optional` **header**: `boolean`

Defined in: core/build/dialect/Dialect.d.ts:19

Whether the file includes a header row with field names

***

### headerJoin?

> `optional` **headerJoin**: `string`

Defined in: core/build/dialect/Dialect.d.ts:27

The character used to join multi-line headers

***

### headerRows?

> `optional` **headerRows**: `number`[]

Defined in: core/build/dialect/Dialect.d.ts:23

Row numbers (zero-based) that are considered header rows

***

### itemKeys?

> `optional` **itemKeys**: `string`[]

Defined in: core/build/dialect/Dialect.d.ts:76

For object-based data items, specifies which object properties to extract as values

***

### itemType?

> `optional` **itemType**: `"object"` \| `"array"`

Defined in: core/build/dialect/Dialect.d.ts:72

The type of data item in the source: 'array' for rows represented as arrays,
or 'object' for rows represented as objects

***

### lineTerminator?

> `optional` **lineTerminator**: `string`

Defined in: core/build/dialect/Dialect.d.ts:43

Character sequence used to terminate rows

***

### name?

> `optional` **name**: `string`

Defined in: core/build/dialect/Dialect.d.ts:11

The name of this dialect

***

### nullSequence?

> `optional` **nullSequence**: `string`

Defined in: core/build/dialect/Dialect.d.ts:59

Character sequence representing null or missing values in the data

***

### property?

> `optional` **property**: `string`

Defined in: core/build/dialect/Dialect.d.ts:67

For JSON data, the property name containing the data array

***

### quoteChar?

> `optional` **quoteChar**: `string`

Defined in: core/build/dialect/Dialect.d.ts:47

Character used to quote fields

***

### sheetName?

> `optional` **sheetName**: `string`

Defined in: core/build/dialect/Dialect.d.ts:84

For spreadsheet data, the sheet name to read

***

### sheetNumber?

> `optional` **sheetNumber**: `number`

Defined in: core/build/dialect/Dialect.d.ts:80

For spreadsheet data, the sheet number to read (zero-based)

***

### skipInitialSpace?

> `optional` **skipInitialSpace**: `boolean`

Defined in: core/build/dialect/Dialect.d.ts:63

Whether to ignore whitespace immediately following the delimiter

***

### table?

> `optional` **table**: `string`

Defined in: core/build/dialect/Dialect.d.ts:88

For database sources, the table name to read
