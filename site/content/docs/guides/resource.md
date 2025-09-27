---
title: Resource
sidebar:
  order: 4
---

Data Resource commands help you work with individual data resources - the building blocks of Data Packages. These commands allow you to infer metadata from data files, validate resource structure, and explore resource properties.

## Available Commands

### `dp resource infer`

Infer a data resource from a table by analyzing its structure and generating metadata including schema information.

```bash
dp resource infer <table-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

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
# Infer resource from CSV file
dp resource infer data.csv

# Infer with custom delimiter
dp resource infer data.csv --delimiter ";"

# Infer from remote file
dp resource infer https://example.com/data.csv

# Infer from resource in package
dp resource infer --from-package datapackage.json --from-resource "users"

# Export as JSON
dp resource infer data.csv --json
```

### `dp resource explore`

Explore a data resource from a local or remote path to view its structure and metadata in an interactive format.

```bash
dp resource explore <descriptor-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Explore resource descriptor
dp resource explore resource.json

# Explore remote resource
dp resource explore https://example.com/resource.json

# Explore resource from package
dp resource explore --from-package datapackage.json --from-resource "users"

# Export structure as JSON
dp resource explore resource.json --json
```

### `dp resource validate`

Validate a data resource from a local or remote path against the Data Resource specification.

```bash
dp resource validate [descriptor-path]
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--json`: Output validation results as JSON
- `--debug`: Enable debug mode
- `-q, --quit`: Exit immediately after validation (don't prompt for error filtering)
- `-a, --all`: Skip selection prompts when all can be selected

**Examples:**
```bash
# Validate resource descriptor
dp resource validate resource.json

# Validate remote resource
dp resource validate https://example.com/resource.json

# Validate resource from package
dp resource validate --from-package datapackage.json --from-resource "users"

# Get validation results as JSON
dp resource validate resource.json --json

# Interactive selection when no path provided
dp resource validate --from-package datapackage.json
```

### `dp resource script`

Open an interactive scripting session with a loaded data resource. This provides a REPL environment where you can programmatically interact with the resource metadata.

```bash
dp resource script <descriptor-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Available Variables:**
- `dpkit`: The dpkit library object
- `resource`: The loaded resource object

**Examples:**
```bash
# Start scripting session with resource
dp resource script resource.json

# Script resource from package
dp resource script --from-package datapackage.json --from-resource "users"

# In the REPL session:
dp> resource.schema.fields.length
dp> resource.schema.fields[0].type
dp> resource.path
```

## Common Workflows

### Creating Resource Metadata

1. **Infer from data file:**
   ```bash
   dp resource infer data.csv --json > resource.json
   ```

2. **Validate the generated resource:**
   ```bash
   dp resource validate resource.json
   ```

3. **Explore the resource structure:**
   ```bash
   dp resource explore resource.json
   ```

### Working with Package Resources

```bash
# Explore all resources in a package interactively
dp resource validate --from-package datapackage.json

# Infer metadata for specific resource
dp resource infer --from-package datapackage.json --from-resource "users"

# Script specific resource from package
dp resource script --from-package datapackage.json --from-resource "transactions"
```

### Resource Analysis Workflow

```bash
# Infer resource with custom options
dp resource infer data.csv \
  --delimiter ";" \
  --header-rows 2 \
  --sample-rows 1000

# Validate the inferred resource
dp resource validate resource.json

# Explore interactively to verify structure
dp resource explore resource.json
```

### Remote Resource Handling

```bash
# Work with remote resources
dp resource explore https://example.com/resource.json
dp resource validate https://example.com/resource.json
dp resource infer https://example.com/data.csv
```

## Resource Selection

When working with resources from packages, you can either:

1. **Specify explicitly:**
   ```bash
   dp resource explore --from-package datapackage.json --from-resource "users"
   ```

2. **Interactive selection:**
   ```bash
   dp resource validate --from-package datapackage.json
   # Will prompt to select from available resources
   ```

## Output Formats

All resource commands support multiple output formats:

- **Interactive Display**: Default rich terminal interface showing resource structure
- **JSON**: Use `--json` flag for machine-readable output
- **Debug Mode**: Use `--debug` for detailed operation logs

## Integration with Package Commands

Resource commands work seamlessly with package commands:

```bash
# Create package, then work with individual resources
dp package infer *.csv --json > datapackage.json
dp resource validate --from-package datapackage.json --from-resource "data"
dp resource explore --from-package datapackage.json --from-resource "users"
```
