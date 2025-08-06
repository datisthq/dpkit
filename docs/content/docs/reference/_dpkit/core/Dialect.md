---
editUrl: false
next: false
prev: false
title: "Dialect"
---

Defined in: [core/dialect/Dialect.ts:8](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L8)

Descriptor that describes the structure of tabular data, such as delimiters,
headers, and other features. Following the Data Package standard:
https://datapackage.org/standard/table-dialect/

## Extends

- [`Metadata`](/reference/_dpkit/core/metadata/)

## Indexable

\[`key`: `` `${string}:${string}` ``\]: `any`

## Properties

### $schema?

> `optional` **$schema**: `string`

Defined in: [core/dialect/Dialect.ts:17](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L17)

JSON schema profile URL for validation

***

### commentChar?

> `optional` **commentChar**: `string`

Defined in: [core/dialect/Dialect.ts:42](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L42)

Character sequence denoting the start of a comment line

***

### commentRows?

> `optional` **commentRows**: `number`[]

Defined in: [core/dialect/Dialect.ts:37](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L37)

Specific rows to be excluded from the data (zero-based)

***

### delimiter?

> `optional` **delimiter**: `string`

Defined in: [core/dialect/Dialect.ts:47](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L47)

The character used to separate fields in the data

***

### doubleQuote?

> `optional` **doubleQuote**: `boolean`

Defined in: [core/dialect/Dialect.ts:62](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L62)

Controls whether a sequence of two quote characters represents a single quote

***

### escapeChar?

> `optional` **escapeChar**: `string`

Defined in: [core/dialect/Dialect.ts:67](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L67)

Character used to escape the delimiter or quote characters

***

### header?

> `optional` **header**: `boolean`

Defined in: [core/dialect/Dialect.ts:22](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L22)

Whether the file includes a header row with field names

***

### headerJoin?

> `optional` **headerJoin**: `string`

Defined in: [core/dialect/Dialect.ts:32](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L32)

The character used to join multi-line headers

***

### headerRows?

> `optional` **headerRows**: `number`[]

Defined in: [core/dialect/Dialect.ts:27](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L27)

Row numbers (zero-based) that are considered header rows

***

### itemKeys?

> `optional` **itemKeys**: `string`[]

Defined in: [core/dialect/Dialect.ts:93](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L93)

For object-based data items, specifies which object properties to extract as values

***

### itemType?

> `optional` **itemType**: `"object"` \| `"array"`

Defined in: [core/dialect/Dialect.ts:88](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L88)

The type of data item in the source: 'array' for rows represented as arrays,
or 'object' for rows represented as objects

***

### lineTerminator?

> `optional` **lineTerminator**: `string`

Defined in: [core/dialect/Dialect.ts:52](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L52)

Character sequence used to terminate rows

***

### name?

> `optional` **name**: `string`

Defined in: [core/dialect/Dialect.ts:12](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L12)

The name of this dialect

***

### nullSequence?

> `optional` **nullSequence**: `string`

Defined in: [core/dialect/Dialect.ts:72](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L72)

Character sequence representing null or missing values in the data

***

### property?

> `optional` **property**: `string`

Defined in: [core/dialect/Dialect.ts:82](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L82)

For JSON data, the property name containing the data array

***

### quoteChar?

> `optional` **quoteChar**: `string`

Defined in: [core/dialect/Dialect.ts:57](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L57)

Character used to quote fields

***

### sheetName?

> `optional` **sheetName**: `string`

Defined in: [core/dialect/Dialect.ts:103](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L103)

For spreadsheet data, the sheet name to read

***

### sheetNumber?

> `optional` **sheetNumber**: `number`

Defined in: [core/dialect/Dialect.ts:98](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L98)

For spreadsheet data, the sheet number to read (zero-based)

***

### skipInitialSpace?

> `optional` **skipInitialSpace**: `boolean`

Defined in: [core/dialect/Dialect.ts:77](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L77)

Whether to ignore whitespace immediately following the delimiter

***

### table?

> `optional` **table**: `string`

Defined in: [core/dialect/Dialect.ts:108](https://github.com/datisthq/dpkit/blob/7a3ebb9422265a09d2e84e0952d10e0101139f80/core/dialect/Dialect.ts#L108)

For database sources, the table name to read
