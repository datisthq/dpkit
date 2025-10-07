---
title: Working with ODS
sidebar:
  label: ODS
  order: 2
---
Comprehensive OpenDocument Spreadsheet (ODS) file handling with sheet selection, advanced header processing, and high-performance data operations.

## Introduction

:::tip
You can use `loadTable` and `saveTable` from `dpkit` instead of `@dpkit/ods` to load and save ODS files if the framework can infer that files are in the `ods` format.
:::

The ODS plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadOdsTable`
- `saveOdsTable`

For example:

```typescript
import { loadOdsTable, saveOdsTable } from "@dpkit/ods"

const table = await loadOdsTable({path: "table.ods"})
// the field types will be automatically inferred
// or you can provide a Table Schema

await saveOdsTable(table, {path: "output.ods"})
```

## Basic Usage

### Reading ODS Files

:::tip
The ouput of `loadOdsTable` is a Polars LazyDataFrame, allowing you to use all of the power of Polars for data processing.
:::

```typescript
import { loadOdsTable } from "@dpkit/ods"

// Load a simple ODS file
const table = await loadOdsTable({ path: "data.ods" })

// Load with custom dialect (specify sheet)
const table = await loadOdsTable({
  path: "data.ods",
  dialect: {
    sheetName: "Sheet2",
    header: true
  }
})

// Load multiple ODS files (concatenated)
const table = await loadOdsTable({
  path: ["part1.ods", "part2.ods", "part3.ods"]
})

// Table is a Polars LazyDataFrame
const df = table.collect()
df.describe()
```

### Saving ODS Files

```typescript
import { saveOdsTable } from "@dpkit/ods"

// Save with default options
await saveOdsTable(table, { path: "output.ods" })

// Save with custom sheet name
await saveOdsTable(table, {
  path: "output.ods",
  dialect: {
    sheetName: "Data"
  }
})
```

## Advanced Features

### Sheet Selection

```typescript
import { loadOdsTable } from "@dpkit/ods"

// Select by sheet number (1-indexed)
const table = await loadOdsTable({
  path: "workbook.ods",
  dialect: {
    sheetNumber: 2  // Load second sheet
  }
})

// Select by sheet name
const table = await loadOdsTable({
  path: "workbook.ods",
  dialect: {
    sheetName: "Sales Data"
  }
})
```

### Multi-Header Row Processing

```typescript
import { loadOdsTable } from "@dpkit/ods"

// ODS with multiple header rows:
// Year | 2023 | 2023 | 2024 | 2024
// Quarter | Q1 | Q2 | Q1 | Q2
// Revenue | 100 | 120 | 110 | 130

const table = await loadOdsTable({
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
import { loadOdsTable } from "@dpkit/ods"

// ODS with comment rows
const table = await loadOdsTable({
  path: "with-comments.ods",
  dialect: {
    commentRows: [1, 2],  // Skip first two rows
    header: true
  }
})

// Skip rows with comment character
const table = await loadOdsTable({
  path: "data.ods",
  dialect: {
    commentChar: "#"  // Skip rows starting with #
  }
})
```

### Remote File Loading

```typescript
import { loadOdsTable } from "@dpkit/ods"

// Load from URL
const table = await loadOdsTable({
  path: "https://example.com/data.ods"
})

// Load multiple remote files
const table = await loadOdsTable({
  path: [
    "https://api.example.com/data-2023.ods",
    "https://api.example.com/data-2024.ods"
  ]
})
```

### Header Options

```typescript
import { loadOdsTable } from "@dpkit/ods"

// No header row (use generated column names)
const table = await loadOdsTable({
  path: "data.ods",
  dialect: {
    header: false
  }
})
// Columns will be: field1, field2, field3, etc.

// Custom header row offset
const table = await loadOdsTable({
  path: "data.ods",
  dialect: {
    headerRows: [3]  // Use third row as header
  }
})
```
