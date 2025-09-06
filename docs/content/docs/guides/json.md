---
title: Working with JSON
sidebar:
  label: JSON
  order: 2
---

The `@dpkit/json` package provides comprehensive support for loading and saving data in JSON and JSONL (JSON Lines) formats. It leverages Polars DataFrames for efficient data processing and supports flexible data transformations through dialect configurations.

## Installation

The JSON package is part of dpkit's modular architecture:

```bash
npm install @dpkit/json
```

## Basic Usage

:::tip
You can use `loadTable` and `saveTable` from `@dpkit/all` instead of `@dpkit/json` to load and save JSON files if the framework can infer that files are in the `json/jsonl` format.
:::

### Loading JSON Data

```typescript
import { loadJsonTable } from "@dpkit/json"

// Load from local file
const table = await loadJsonTable({ path: "data.json" })

// Load from remote URL
const table = await loadJsonTable({
  path: "https://example.com/data.json"
})

// Load multiple files (concatenated)
const table = await loadJsonTable({
  path: ["file1.json", "file2.json"]
})
```

### Loading JSONL Data

```typescript
import { loadJsonTable } from "@dpkit/json"

// Load JSONL (JSON Lines) format
const table = await loadJsonTable({ path: "data.jsonl", format: 'jsonl' })
```

### Saving Data

```typescript
import { saveJsonTable } from "@dpkit/json"

// Save as JSON
await saveJsonTable(table, { path: "output.json" })

// Save as JSONL
await saveJsonTable(table, { path: "output.jsonl", format: 'jsonl' })
```

## Data Formats

The package supports two main JSON formats:

### JSON Format
Standard JSON arrays of objects:
```json
[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]
```

### JSONL Format
Newline-delimited JSON objects:
```jsonl
{"id": 1, "name": "Alice"}
{"id": 2, "name": "Bob"}
```

## Dialect Support

Dialects provide flexible data transformation capabilities:

### Property Extraction

Extract data from nested objects using the `property` option:

```typescript
// Input: {"users": [{"id": 1, "name": "Alice"}]}
const table = await loadJsonTable({
  path: "data.json",
  dialect: { property: "users" }
})
```

### Item Keys Filtering

Select specific fields using `itemKeys`:

```typescript
// Only load 'name' field from each record
const table = await loadJsonTable({
  path: "data.json",
  dialect: { itemKeys: ["name"] }
})
```

### Array Format Handling

Handle CSV-style array data with `itemType: "array"`:

```typescript
// Input: [["id", "name"], [1, "Alice"], [2, "Bob"]]
const table = await loadJsonTable({
  path: "data.json",
  dialect: { itemType: "array" }
})
```
