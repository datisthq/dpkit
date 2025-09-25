---
title: Schema
sidebar:
  order: 6
---

Table Schema commands help you work with table schemas - metadata that describes the structure, types, and constraints of tabular data. These commands allow you to infer schema from data, validate schema definitions, and explore schema properties.

## Available Commands

### `dp schema infer`

Infer a table schema from a table by analyzing its data and generating field definitions including types, constraints, and formats.

```bash
dp schema infer <table-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--json`: Output as JSON
- `--debug`: Enable debug mode

**Table Dialect Options:**
- `--delimiter`: Field delimiter character
- `--header`: Whether files have headers
- `--header-rows`: Number of header rows
- `--header-join`: Join character for multi-row headers
- `--comment-rows`: Number of comment rows to skip
- `--comment-char`: Comment character
- `--quote-char`: Quote character for fields
- `--double-quote`: Whether quotes are doubled for escaping
- `--escape-char`: Escape character
- `--null-sequence`: Sequence representing null values
- `--skip-initial-space`: Skip initial whitespace
- `--property`: JSON property path for nested data
- `--item-type`: Type of items in arrays
- `--item-keys`: Keys for object items
- `--sheet-number`: Excel sheet number
- `--sheet-name`: Excel sheet name
- `--table`: Database table name
- `--sample-bytes`: Bytes to sample for inference

**Table Schema Options:**
- `--field-names`: Override field names
- `--field-types`: Override field types
- `--missing-values`: Values to treat as missing
- `--string-format`: String format specification
- `--decimal-char`: Decimal separator character
- `--group-char`: Thousands separator character
- `--bare-number`: Allow bare numbers
- `--true-values`: Values to treat as true
- `--false-values`: Values to treat as false
- `--datetime-format`: DateTime format string
- `--date-format`: Date format string
- `--time-format`: Time format string
- `--array-type`: Type of array elements
- `--list-delimiter`: List item delimiter
- `--list-item-type`: Type of list items
- `--geopoint-format`: Geopoint format specification
- `--geojson-format`: GeoJSON format specification
- `--sample-rows`: Rows to sample for inference
- `--confidence`: Confidence threshold for type inference
- `--comma-decimal`: Use comma as decimal separator
- `--month-first`: Parse dates with month first
- `--keep-strings`: Keep string types when possible

**Examples:**
```bash
# Infer schema from CSV file
dp schema infer data.csv

# Infer with custom delimiter and date format
dp schema infer data.csv --delimiter ";" --date-format "%d/%m/%Y"

# Infer from remote file
dp schema infer https://example.com/data.csv

# Infer from resource in package
dp schema infer --from-package datapackage.json --from-resource "users"

# Export schema as JSON
dp schema infer data.csv --json > schema.json
```

### `dp schema explore`

Explore a table schema from a local or remote path to view its field definitions and constraints in an interactive format.

```bash
dp schema explore <descriptor-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--json`: Output as JSON
- `--debug`: Enable debug mode

**Examples:**
```bash
# Explore schema descriptor
dp schema explore schema.json

# Explore remote schema
dp schema explore https://example.com/schema.json

# Explore schema from package resource
dp schema explore --from-package datapackage.json --from-resource "users"

# Export schema structure as JSON
dp schema explore schema.json --json
```

### `dp schema validate`

Validate a table schema from a local or remote path against the Table Schema specification.

```bash
dp schema validate <descriptor-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--json`: Output validation results as JSON
- `--debug`: Enable debug mode
- `--quit`: Exit immediately after validation (don't prompt for error filtering)

**Examples:**
```bash
# Validate schema descriptor
dp schema validate schema.json

# Validate remote schema
dp schema validate https://example.com/schema.json

# Validate schema from package resource
dp schema validate --from-package datapackage.json --from-resource "users"

# Get validation results as JSON
dp schema validate schema.json --json

# Interactive selection when no path provided
dp schema validate --from-package datapackage.json
```

### `dp schema script`

Open an interactive scripting session with a loaded table schema. This provides a REPL environment where you can programmatically interact with the schema definition.

```bash
dp schema script <descriptor-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--json`: Output as JSON
- `--debug`: Enable debug mode

**Available Variables:**
- `dpkit`: The dpkit library object
- `schema`: The loaded schema object

**Examples:**
```bash
# Start scripting session with schema
dp schema script schema.json

# Script schema from package resource
dp schema script --from-package datapackage.json --from-resource "users"

# In the REPL session:
dp> schema.fields.length
dp> schema.fields[0].name
dp> schema.fields.filter(f => f.type === 'integer')
dp> schema.primaryKey
```

## Common Workflows

### Creating Schema Definitions

1. **Infer from data file:**
   ```bash
   dp schema infer data.csv --json > schema.json
   ```

2. **Validate the generated schema:**
   ```bash
   dp schema validate schema.json
   ```

3. **Explore the schema structure:**
   ```bash
   dp schema explore schema.json
   ```

### Schema Analysis and Refinement

```bash
# Infer schema with high confidence threshold
dp schema infer data.csv --confidence 0.8 --sample-rows 10000

# Validate and explore for refinement
dp schema validate schema.json
dp schema explore schema.json

# Script for custom analysis
dp schema script schema.json
```

### Working with Package Schemas

```bash
# Validate all schemas in a package interactively
dp schema validate --from-package datapackage.json

# Infer improved schema for specific resource
dp schema infer --from-package datapackage.json --from-resource "transactions"

# Compare schemas using scripting
dp schema script --from-package datapackage.json --from-resource "users"
```

### Custom Type Inference

```bash
# Configure specific data types and formats
dp schema infer data.csv \
  --datetime-format "%Y-%m-%d %H:%M:%S" \
  --true-values "Yes,True,1" \
  --false-values "No,False,0" \
  --decimal-char "," \
  --missing-values "NULL,N/A,,"
```

### Remote Schema Handling

```bash
# Work with remote schemas
dp schema explore https://example.com/schema.json
dp schema validate https://example.com/schema.json
dp schema infer https://example.com/data.csv
```

## Schema Field Types

The schema inference supports various field types:

- **Basic Types**: `string`, `integer`, `number`, `boolean`
- **Date/Time Types**: `date`, `datetime`, `time`, `year`, `yearmonth`, `duration`
- **Structured Types**: `array`, `object`, `list`
- **Geographic Types**: `geopoint`, `geojson`

## Advanced Inference Options

### Confidence Tuning
```bash
# High confidence for clean data
dp schema infer data.csv --confidence 0.9

# Lower confidence for messy data
dp schema infer data.csv --confidence 0.6
```

### Sample Size Control
```bash
# Large sample for better inference
dp schema infer large_data.csv --sample-rows 50000

# Quick inference with small sample
dp schema infer data.csv --sample-rows 100
```

### Format Specifications
```bash
# European date format
dp schema infer data.csv --date-format "%d.%m.%Y"

# Custom boolean values
dp schema infer data.csv --true-values "Ja,Oui,Sí" --false-values "Nein,Non,No"
```

## Output Formats

All schema commands support multiple output formats:

- **Interactive Display**: Default rich terminal interface showing field definitions
- **JSON**: Use `--json` flag for machine-readable output
- **Debug Mode**: Use `--debug` for detailed operation logs

## Integration with Other Commands

Schema commands work seamlessly with other dpkit commands:

```bash
# Create schema, then use it for validation
dp schema infer data.csv --json > schema.json
dp table validate data.csv --schema schema.json

# Work within package context
dp package infer *.csv --json > datapackage.json
dp schema validate --from-package datapackage.json --from-resource "data"
```
