---
title: Working with XLSX
sidebar:
  label: XLSX
  order: 1
---
Comprehensive Excel (.xlsx) file handling with sheet selection, advanced header processing, and high-performance data operations.

## Introduction

The XLSX plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadXlsxTable`
- `saveXlsxTable`

These functions handle XLSX files at the IO and dialect level, supporting Microsoft Excel formats.

For complete loading and processing of XLSX files, the [dpkit](https://github.com/datisthq/dpkit) ecosystem provides the `readTable` function which is a high-level function that handles both loading and processing of XLSX files, and `saveTable` for saving XLSX files.

The XLSX plugin automatically handles `.xlsx` files when using dpkit:

```typescript
import { readTable, saveTable } from "@dpkit/all"

const table = await readTable({path: "table.xlsx"})
// the field types will be automatically inferred
// or you can provide a Table Schema

await saveTable(table, {path: "output.xlsx"})
```

## Basic Usage

### Reading XLSX Files

:::tip
The ouput of `readTable` is a Polars LazyDataFrame, allowing you to use all of the power of Polars for data processing.
:::

```typescript
import { readTable } from "@dpkit/all"

// Load a simple XLSX file
const table = await readTable({ path: "data.xlsx" })

// Load with custom dialect (specify sheet)
const table = await readTable({
  path: "data.xlsx",
  dialect: {
    sheetName: "Sheet2",
    header: true
  }
})

// Load multiple XLSX files (concatenated)
const table = await readTable({
  path: ["part1.xlsx", "part2.xlsx", "part3.xlsx"]
})

// Table is a Polars LazyDataFrame
const df = table.collect()
df.describe()
```

### Saving XLSX Files

```typescript
import { saveTable } from "@dpkit/all"

// Save with default options
await saveTable(table, { path: "output.xlsx" })

// Save with custom sheet name
await saveTable(table, {
  path: "output.xlsx",
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
  path: "workbook.xlsx",
  dialect: {
    sheetNumber: 2  // Load second sheet
  }
})

// Select by sheet name
const table = await readTable({
  path: "workbook.xlsx",
  dialect: {
    sheetName: "Sales Data"
  }
})
```

### Multi-Header Row Processing

```typescript
import { readTable } from "@dpkit/all"

// XLSX with multiple header rows:
// Year | 2023 | 2023 | 2024 | 2024
// Quarter | Q1 | Q2 | Q1 | Q2
// Revenue | 100 | 120 | 110 | 130

const table = await readTable({
  path: "multi-header.xlsx",
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

// XLSX with comment rows
const table = await readTable({
  path: "with-comments.xlsx",
  dialect: {
    commentRows: [1, 2],  // Skip first two rows
    header: true
  }
})

// Skip rows with comment character
const table = await readTable({
  path: "data.xlsx",
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
  path: "https://example.com/data.xlsx"
})

// Load multiple remote files
const table = await readTable({
  path: [
    "https://api.example.com/data-2023.xlsx",
    "https://api.example.com/data-2024.xlsx"
  ]
})
```

### Header Options

```typescript
import { readTable } from "@dpkit/all"

// No header row (use generated column names)
const table = await readTable({
  path: "data.xlsx",
  dialect: {
    header: false
  }
})
// Columns will be: column_1, column_2, column_3, etc.

// Custom header row offset
const table = await readTable({
  path: "data.xlsx",
  dialect: {
    headerRows: [3]  // Use third row as header
  }
})
```
