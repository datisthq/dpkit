# @dpkit/table

The `@dpkit/table` package provides high-performance data validation and processing capabilities for tabular data. Built on top of **nodejs-polars** (a Rust-based DataFrame library), it offers robust schema validation, type inference, and error handling for CSV, Excel, and other tabular data formats.

## Examples

### Basic Table Inspection

```typescript
import { DataFrame } from "nodejs-polars"
import { inspectTable } from "@dpkit/table"
import type { Schema } from "@dpkit/core"

// Create a table from data
const table = DataFrame({
  id: [1, 2, 3],
  name: ["John", "Jane", "Bob"],
  email: ["john@example.com", "jane@example.com", "bob@example.com"]
}).lazy()

// Define schema with constraints
const schema: Schema = {
  fields: [
    { name: "id", type: "integer", constraints: { required: true, unique: true } },
    { name: "name", type: "string", constraints: { required: true } },
    { name: "email", type: "string", constraints: { pattern: "^[^@]+@[^@]+\\.[^@]+$" } }
  ]
}

// Inspect the table
const errors = await inspectTable(table, { schema })
console.log(errors) // Array of validation errors
```

### Schema Inference

```typescript
import { inferSchema } from "@dpkit/table"

// Automatically infer schema from data patterns
const table = DataFrame({
  id: ["1", "2", "3"],
  price: ["10.50", "25.00", "15.75"],
  date: ["2023-01-15", "2023-02-20", "2023-03-25"],
  active: ["true", "false", "true"]
}).lazy()

const inferredSchema = await inferSchema(table, {
  sampleSize: 100,      // Sample size for inference
  confidence: 0.9,      // Confidence threshold
  monthFirst: false,    // Date format preference
  commaDecimal: false   // Decimal separator preference
})

// Result: automatically detected integer, number, date, and boolean types
```

### Field Matching Strategies

```typescript
// Subset matching - data can have extra fields
const schema: Schema = {
  fieldsMatch: "subset",
  fields: [
    { name: "id", type: "number" },
    { name: "name", type: "string" }
  ]
}

// Equal matching - field names must match regardless of order
const equalSchema: Schema = {
  fieldsMatch: "equal",
  fields: [
    { name: "id", type: "number" },
    { name: "name", type: "string" }
  ]
}
```

### Table Processing

```typescript
import { processTable } from "@dpkit/table"

// Process table with schema (converts string columns to proper types)
const table = DataFrame({
  id: ["1", "2", "3"],        // String data
  price: ["10.50", "25.00", "15.75"],
  active: ["true", "false", "true"],
  date: ["2023-01-15", "2023-02-20", "2023-03-25"]
}).lazy()

const schema: Schema = {
  fields: [
    { name: "id", type: "integer" },
    { name: "price", type: "number" },
    { name: "active", type: "boolean" },
    { name: "date", type: "date" }
  ]
}

const processedTable = await processTable(table, { schema })
const result = await processedTable.collect()

// Result will have properly typed columns:
// { id: 1, price: 10.50, active: true, date: Date('2023-01-15') }
// { id: 2, price: 25.00, active: false, date: Date('2023-02-20') }
// { id: 3, price: 15.75, active: true, date: Date('2023-03-25') }
```

### Error Handling

```typescript
const result = await inspectTable(table, { schema })

result.errors.forEach(error => {
  switch (error.type) {
    case "cell/required":
      console.log(`Required field missing in row ${error.rowNumber}: '${error.fieldName}'`)
      break
    case "cell/unique":
      console.log(`Duplicate value in row ${error.rowNumber}: '${error.cell}'`)
      break
    case "cell/pattern":
      console.log(`Pattern mismatch: '${error.cell}' doesn't match ${error.constraint}`)
      break
  }
})
```

## Core Architecture

### Table Type
The package uses `LazyDataFrame` from nodejs-polars as its core table representation, enabling lazy evaluation and efficient processing of large datasets through vectorized operations.

### Schema Integration
Integrates seamlessly with `@dpkit/core` schemas, bridging Data Package field definitions with Polars data types for comprehensive validation workflows.

## Key Features

### 1. Multi-Level Validation System

**Field-Level Validation:**
- **Type Validation**: Converts and validates data types (string → integer, etc.)
- **Name Validation**: Ensures field names match schema requirements
- **Constraint Validation**: Enforces required, unique, enum, pattern, min/max values, and length constraints

**Table-Level Validation:**
- **Field Presence**: Validates missing/extra fields based on flexible matching strategies
- **Schema Compatibility**: Ensures data structure aligns with schema definitions

**Row-Level Validation:**
- **Primary Key Uniqueness**: Validates unique identifiers
- **Composite Keys**: Supports multi-column unique constraints

### 2. Comprehensive Field Types

**Primitive Types:**
- `string`, `integer`, `number`, `boolean`

**Temporal Types:**
- `date`, `datetime`, `time`, `year`, `yearmonth`, `duration`

**Spatial Types:**
- `geopoint`, `geojson`

**Complex Types:**
- `array`, `list`, `object`

### 3. Smart Schema Inference

Automatically infers field types and formats from data using:
- Regex pattern matching with configurable confidence thresholds
- Locale-specific format detection (comma decimals, date formats)
- Complex type recognition (objects, arrays, temporal data)

### 4. Flexible Field Matching Strategies

- **exact**: Fields must match exactly in order and count
- **equal**: Same fields in any order
- **subset**: Data must contain all schema fields (extras allowed)
- **superset**: Schema must contain all data fields
- **partial**: At least one field must match

### 5. Advanced Data Processing

**Format-Aware Parsing:**
- Handles missing values at schema and field levels
- Supports group/decimal character customization
- Processes currency symbols and whitespace
- Parses complex formats (ISO dates, scientific notation)

**Performance Optimizations:**
- Sample-based validation for large datasets
- Lazy evaluation for memory efficiency
- Vectorized constraint checking
- Configurable error limits and batch processing

## Error Handling

### Comprehensive Error Taxonomy

**Field Errors:**
- Name mismatches between schema and data
- Type conversion failures
- Missing or extra field violations

**Cell Errors:**
- Type validation failures with specific conversion details
- Constraint violations (required, unique, enum, pattern, range, length)
- Format parsing errors with problematic values

**Row Errors:**
- Unique key constraint violations
- Composite constraint failures

### Error Details
Each error includes:
- Precise row and column locations
- Actual vs expected values
- Specific error type classification
- Actionable error messages for debugging
