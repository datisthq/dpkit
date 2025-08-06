---
title: Working with Parquet
sidebar:
  order: 4
---

The `@dpkit/parquet` package provides efficient support for loading and saving data in Apache Parquet format. It uses Polars DataFrames for high-performance columnar data processing.

## Installation

```bash
npm install @dpkit/parquet
```

## Basic Usage

### Loading Data

```typescript
import { loadParquetTable } from "@dpkit/parquet"

// Load from local file
const table = await loadParquetTable({ path: "data.parquet" })

// Load from remote URL
const table = await loadParquetTable({
  path: "https://example.com/data.parquet"
})

// Load multiple files (concatenated)
const table = await loadParquetTable({
  path: ["file1.parquet", "file2.parquet"]
})
```

### Saving Data

```typescript
import { saveParquetTable } from "@dpkit/parquet"

// Save as Parquet format
await saveParquetTable(table, { path: "output.parquet" })
```
