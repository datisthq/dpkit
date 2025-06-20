# @dpkit/inline

Package for reading inline data tables embedded directly in data package resources.

## Features

- **Array Format**: Read tabular data from arrays with header row
- **Object Format**: Read tabular data from arrays of objects
- **Schema Processing**: Apply table schema validation and type conversion
- **Missing Data Handling**: Gracefully handle missing cells and mismatched row lengths

## Examples

### Array Format Data

```typescript
import { readInlineTable } from "@dpkit/inline"

const resource = {
  name: "languages",
  type: "table",
  data: [
    ["id", "name"],
    [1, "english"],
    [2, "中文"]
  ]
}

const table = await readInlineTable(resource)
```

### Object Format Data

```typescript
const resource = {
  name: "languages",
  type: "table",
  data: [
    { id: 1, name: "english" },
    { id: 2, name: "中文" }
  ]
}

const table = await readInlineTable(resource)
```

### With Processing Based on Schema

```typescript
const resource = {
  name: "languages",
  type: "table",
  data: [
    ["id", "name"],
    [1, "english"],
    [2, "中文"]
  ],
  schema: {
    fields: [
      { name: "id", type: "integer" },
      { name: "name", type: "string" }
    ]
  }
}

const table = await readInlineTable(resource)
```

### Inline Resource Validation

```typescript
import { validateInlineTable } from "@dpkit/inline"

const resource = {
  name: "languages",
  type: "table",
  data: [
    ["id", "name"],
    [1, "english"],
    [2, "中文"]
  ],
  schema: {
    fields: [
      { name: "id", type: "integer" },
      { name: "name", type: "integer" }
    ]
  }
}

const {valid, errors} = await validateInlineTable(resource)
//{
//  type: "cell/type",
//  fieldName: "name",
//  rowNumber: 1,
//  cell: "english",
//}
//{
//  type: "cell/type",
//  fieldName: "name",
//  rowNumber: 2,
//  cell: "中文",
//}
```

