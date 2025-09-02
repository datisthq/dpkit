---
title: Working with ODS
sidebar:
  label: ODS
  order: 2
---
Comprehensive OpenDocument Spreadsheet (ODS) file handling with sheet selection, advanced header processing, and high-performance data operations.

## Introduction

The ODS plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadOdsTable`
- `saveOdsTable`

These functions handle ODS files at the IO and dialect level, supporting LibreOffice Calc and OpenOffice Calc formats.

For complete loading and processing of ODS files, the [dpkit](https://github.com/datisthq/dpkit) ecosystem provides the `readTable` function which is a high-level function that handles both loading and processing of ODS files, and `saveTable` for saving ODS files.

The ODS plugin automatically handles `.ods` files when using dpkit:

```typescript
import { readTable, saveTable } from "@dpkit/all"

const table = await readTable({path: "table.ods"})
// the field types will be automatically inferred
// or you can provide a Table Schema

await saveTable(table, {path: "output.ods"})
```

## Basic Usage

### Reading ODS Files

:::tip
The ouput of `readTable` is a Polars LazyDataFrame, allowing you to use all of the power of Polars for data processing.
:::

```typescript
import { readTable } from "@dpkit/all"

// Load a simple ODS file
const table = await readTable({ path: "data.ods" })

// Load with custom dialect (specify sheet)
const table = await readTable({
  path: "data.ods",
  dialect: {
    sheetName: "Sheet2",
    header: true
  }
})

// Load multiple ODS files (concatenated)
const table = await readTable({
  path: ["part1.ods", "part2.ods", "part3.ods"]
})

// Table is a Polars LazyDataFrame
const df = table.collect()
df.describe()
```

### Saving ODS Files

```typescript
import { saveTable } from "@dpkit/all"

// Save with default options
await saveTable(table, { path: "output.ods" })

// Save with custom sheet name
await saveTable(table, {
  path: "output.ods",
  dialect: {
    sheetName: "Data"
  }
})
```

## Advanced Features

### Sheet Selection

```typescript
import { readTable } from "@dpkit/all"

// Select by sheet number (1-indexed)
const table = await readTable({
  path: "workbook.ods",
  dialect: {
    sheetNumber: 2  // Load second sheet
  }
})

// Select by sheet name
const table = await readTable({
  path: "workbook.ods",
  dialect: {
    sheetName: "Sales Data"
  }
})
```

### Multi-Header Row Processing

```typescript
import { readTable } from "@dpkit/all"

// ODS with multiple header rows:
// Year | 2023 | 2023 | 2024 | 2024
// Quarter | Q1 | Q2 | Q1 | Q2
// Revenue | 100 | 120 | 110 | 130

const table = await readTable({
  path: "multi-header.ods",
  dialect: {
    headerRows: [1, 2],
    headerJoin: "_"
  }
})
// Resulting columns: ["Year_Quarter", "2023_Q1", "2023_Q2", "2024_Q1", "2024_Q2"]
```

### Comment Row Handling

```typescript
import { readTable } from "@dpkit/all"

// ODS with comment rows
const table = await readTable({
  path: "with-comments.ods",
  dialect: {
    commentRows: [1, 2],  // Skip first two rows
    header: true
  }
})

// Skip rows with comment character
const table = await readTable({
  path: "data.ods",
  dialect: {
    commentChar: "#"  // Skip rows starting with #
  }
})
```

### Remote File Loading

```typescript
import { readTable } from "@dpkit/all"

// Load from URL
const table = await readTable({
  path: "https://example.com/data.ods"
})

// Load multiple remote files
const table = await readTable({
  path: [
    "https://api.example.com/data-2023.ods",
    "https://api.example.com/data-2024.ods"
  ]
})
```

### Header Options

```typescript
import { readTable } from "@dpkit/all"

// No header row (use generated column names)
const table = await readTable({
  path: "data.ods",
  dialect: {
    header: false
  }
})
// Columns will be: column_1, column_2, column_3, etc.

// Custom header row offset
const table = await readTable({
  path: "data.ods",
  dialect: {
    headerRows: [3]  // Use third row as header
  }
})
```
