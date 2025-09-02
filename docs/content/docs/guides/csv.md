---
title: Working with CSV
sidebar:
  label: CSV
  order: 1
---
Comprehensive CSV and TSV file handling with automatic format detection, advanced header processing, and high-performance data operations.

## Introduction

The CSV plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadCsvTable`
- `saveCsvTable`
- `inferCsvDialect`

These functions are low-level and handles only CSV files on the IO and dialect level. So, for example, `loadCsvTable` will always return all the fields having a string type.

For having both loading and processing of CSV files, the [dpkit](https://github.com/datisthq/dpkit) ecosystem provides the `readTable` function which is a high-level function that handles both loading and processing of CSV files.

The CSV plugin automatically handles `.csv` and `.tsv` files when using dpkit:

```typescript
import { readTable } from "@dpkit/all"

const table = await readTable({path: "table.csv"})
// the field types will be automatically inferred
// or you can provide a Table Schema
```

## Basic Usage

### Loading CSV Files

```typescript
import { loadCsvTable } from "@dpkit/csv"

// Load a simple CSV file
const table = await loadCsvTable({ path: "data.csv" })

// Load with custom dialect
const table = await loadCsvTable({
  path: "data.csv",
  dialect: {
    delimiter: ";",
    header: true,
    skipInitialSpace: true
  }
})

// Load multiple CSV files (concatenated)
const table = await loadCsvTable({
  path: ["part1.csv", "part2.csv", "part3.csv"]
})
```

### Saving CSV Files

```typescript
import { saveCsvTable } from "@dpkit/csv"

// Save with default options
await saveCsvTable(table, { path: "output.csv" })

// Save with custom dialect
await saveCsvTable(table, {
  path: "output.csv",
  dialect: {
    delimiter: "\t",
    quoteChar: "'"
  }
})
```

### Dialect Detection

```typescript
import { inferCsvDialect } from "@dpkit/csv"

// Automatically detect CSV format
const dialect = await inferCsvDialect({ path: "unknown-dialect.csv" })
console.log(dialect) // { delimiter: ",", header: true, quoteChar: '"' }

// Use detected dialect to load
const table = await loadCsvTable({
  path: "unknown-dialect.csv",
  dialect
})
```

## Advanced Features

### Multi-Header Row Processing

```typescript
// CSV with multiple header rows:
// Year,2023,2023,2024,2024
// Quarter,Q1,Q2,Q1,Q2
// Revenue,100,120,110,130

const table = await loadCsvTable({
  path: "multi-header.csv",
  dialect: {
    headerRows: [1, 2],
    headerJoin: "_"
  }
})
// Resulting columns: ["Year_Quarter", "2023_Q1", "2023_Q2", "2024_Q1", "2024_Q2"]
```

### Comment Row Handling

```typescript
// CSV with comment rows:
// # This is a comment
// # Generated on 2024-01-01
// Name,Age,City
// John,25,NYC

const table = await loadCsvTable({
  path: "with-comments.csv",
  dialect: {
    commentRows: [1, 2],
    header: true
  }
})
```

### Remote File Loading

```typescript
// Load from URL
const table = await loadCsvTable({
  path: "https://example.com/data.csv"
})

// Load multiple remote files
const table = await loadCsvTable({
  path: [
    "https://api.example.com/data-2023.csv",
    "https://api.example.com/data-2024.csv"
  ]
})
```
