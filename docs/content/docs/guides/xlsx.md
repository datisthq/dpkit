---
title: Working with XLSX
sidebar:
  label: XLSX
  order: 1
---
Comprehensive Excel (.xlsx) file handling with sheet selection, advanced header processing, and high-performance data operations.

## Introduction

> [!TIP]
> You can use `loadTable` and `saveTable` from `dpkit` instead of `@dpkit/xlsx` to load and save XLSX files if the framework can infer that files are in the `xlsx` format.

The XLSX plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadXlsxTable`
- `saveXlsxTable`

For example:

```typescript
import { loadXlsxTable, saveXlsxTable } from "@dpkit/xlsx"

const table = await loadXlsxTable({path: "table.xlsx"})
// the field types will be automatically inferred
// or you can provide a Table Schema

await saveXlsxTable(table, {path: "output.xlsx"})
```

## Basic Usage

### Reading XLSX Files

> [!TIP]
> The ouput of `loadXlsxTable` is a Polars LazyDataFrame, allowing you to use all of the power of Polars for data processing.

```typescript
import { loadXlsxTable } from "@dpkit/xlsx"

// Load a simple XLSX file
const table = await loadXlsxTable({ path: "data.xlsx" })

// Load with custom dialect (specify sheet)
const table = await loadXlsxTable({
  path: "data.xlsx",
  dialect: {
    sheetName: "Sheet2",
    header: true
  }
})

// Load multiple XLSX files (concatenated)
const table = await loadXlsxTable({
  path: ["part1.xlsx", "part2.xlsx", "part3.xlsx"]
})

// Table is a Polars LazyDataFrame
const df = table.collect()
df.describe()
```

### Saving XLSX Files

```typescript
import { saveXlsxTable } from "@dpkit/xlsx"

// Save with default options
await saveXlsxTable(table, { path: "output.xlsx" })

// Save with custom sheet name
await saveXlsxTable(table, {
  path: "output.xlsx",
  dialect: {
    sheetName: "Data"
  }
})
```

## Advanced Features

### Sheet Selection

```typescript
import { loadXlsxTable } from "@dpkit/xlsx"

// Select by sheet number (1-indexed)
const table = await loadXlsxTable({
  path: "workbook.xlsx",
  dialect: {
    sheetNumber: 2  // Load second sheet
  }
})

// Select by sheet name
const table = await loadXlsxTable({
  path: "workbook.xlsx",
  dialect: {
    sheetName: "Sales Data"
  }
})
```

### Multi-Header Row Processing

```typescript
import { loadXlsxTable } from "@dpkit/xlsx"

// XLSX with multiple header rows:
// Year | 2023 | 2023 | 2024 | 2024
// Quarter | Q1 | Q2 | Q1 | Q2
// Revenue | 100 | 120 | 110 | 130

const table = await loadXlsxTable({
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
import { loadXlsxTable } from "@dpkit/xlsx"

// XLSX with comment rows
const table = await loadXlsxTable({
  path: "with-comments.xlsx",
  dialect: {
    commentRows: [1, 2],  // Skip first two rows
    header: true
  }
})

// Skip rows with comment character
const table = await loadXlsxTable({
  path: "data.xlsx",
  dialect: {
    commentChar: "#"  // Skip rows starting with #
  }
})
```

### Remote File Loading

```typescript
import { loadXlsxTable } from "@dpkit/xlsx"

// Load from URL
const table = await loadXlsxTable({
  path: "https://example.com/data.xlsx"
})

// Load multiple remote files
const table = await loadXlsxTable({
  path: [
    "https://api.example.com/data-2023.xlsx",
    "https://api.example.com/data-2024.xlsx"
  ]
})
```

### Header Options

```typescript
import { loadXlsxTable } from "@dpkit/xlsx"

// No header row (use generated column names)
const table = await loadXlsxTable({
  path: "data.xlsx",
  dialect: {
    header: false
  }
})
// Columns will be: field1, field2, field3, etc.

// Custom header row offset
const table = await loadXlsxTable({
  path: "data.xlsx",
  dialect: {
    headerRows: [3]  // Use third row as header
  }
})
```
