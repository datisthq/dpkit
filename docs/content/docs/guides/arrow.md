---
title: Working with Arrow
sidebar:
  order: 3
---

The `@dpkit/arrow` package provides efficient support for loading and saving data in Apache Arrow format. It uses Polars DataFrames for high-performance columnar data processing.

## Installation

```bash
npm install @dpkit/arrow
```

## Basic Usage

### Loading Data

```typescript
import { loadArrowTable } from "@dpkit/arrow"

// Load from local file
const table = await loadArrowTable({ path: "data.arrow" })

// Load multiple files (concatenated)
const table = await loadArrowTable({
  path: ["file1.arrow", "file2.arrow"]
})
```

### Saving Data

```typescript
import { saveArrowTable } from "@dpkit/arrow"

// Save as Arrow format
await saveArrowTable(table, { path: "output.arrow" })
```
