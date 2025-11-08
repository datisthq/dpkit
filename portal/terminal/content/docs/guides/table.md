---
title: Table
sidebar:
  order: 7
---

Table commands help you work directly with tabular data files. These commands allow you to explore, validate, convert, and analyze data tables with support for various formats including CSV, Excel, JSON, and more.

## Available Commands

### `dpkit table convert`

Convert a table from one format to another with support for various input and output formats.

```bash
dpkit table convert <source-path> <target-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-s, --silent`: Suppress all output except errors
- `-d, --debug`: Enable debug mode

**Supported Formats:**
- **Input**: CSV, TSV, Excel (.xlsx, .xls), JSON, Parquet, Arrow, ODS
- **Output**: CSV, TSV, Excel (.xlsx), JSON, Parquet, Arrow, ODS

**Examples:**
```bash
# Convert CSV to Excel
dpkit table convert data.csv data.xlsx

# Convert Excel to JSON
dpkit table convert data.xlsx data.json

# Convert from package resource
dpkit table convert --from-package datapackage.json --from-resource "users" users.xlsx

# Convert Parquet to CSV
dpkit table convert data.parquet data.csv
```

### `dpkit table describe`

Generate statistical descriptions and summaries of table data including column statistics, data types, and quality metrics.

```bash
dpkit table describe <table-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Describe CSV file
dpkit table describe data.csv

# Describe with JSON output
dpkit table describe data.csv --json

# Describe resource from package
dpkit table describe --from-package datapackage.json --from-resource "sales"

# Describe remote table
dpkit table describe https://example.com/data.csv
```

### `dpkit table explore`

Explore a table interactively, viewing data samples, column information, and basic statistics in a rich terminal interface.

```bash
dpkit table explore <table-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--schema`: Path to schema file for validation during exploration
- `--dialect`: Path to dialect file for parsing configuration
- `--json`: Output as JSON
- `--debug`: Enable debug mode

**Examples:**
```bash
# Explore CSV file
dpkit table explore data.csv

# Explore with schema validation
dpkit table explore data.csv --schema schema.json

# Explore with custom dialect
dpkit table explore data.csv --dialect dialect.json

# Explore resource from package
dpkit table explore --from-package datapackage.json --from-resource "users"

# Explore remote table
dpkit table explore https://example.com/data.csv
```

### `dpkit table validate`

Validate table data against a schema, checking data types, constraints, and data quality issues.

```bash
dpkit table validate <table-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--schema`: Path to schema file for validation
- `--dialect`: Path to dialect file for parsing
- `--json`: Output validation results as JSON
- `--debug`: Enable debug mode
- `-q, --quit`: Exit immediately after validation (don't prompt for error filtering)
- `-a, --all`: Skip selection prompts when all can be selected

**Examples:**
```bash
# Validate with schema
dpkit table validate data.csv --schema schema.json

# Validate with custom dialect and schema
dpkit table validate data.csv --dialect dialect.json --schema schema.json

# Validate resource from package
dpkit table validate --from-package datapackage.json --from-resource "users"

# Get validation results as JSON
dpkit table validate data.csv --schema schema.json --json

# Validate remote table
dpkit table validate https://example.com/data.csv --schema https://example.com/schema.json
```

### `dpkit table script`

Open an interactive scripting session with a loaded table. This provides a REPL environment where you can programmatically analyze and manipulate table data.

```bash
dpkit table script <table-path>
```

**Options:**
- `--from-package`: Path to package containing the resource
- `--from-resource`: Name of resource within package
- `--schema`: Path to schema file
- `--dialect`: Path to dialect file
- `--json`: Output as JSON
- `--debug`: Enable debug mode

**Available Variables:**
- `dpkit`: The dpkit library object
- `table`: The loaded table object

**Examples:**
```bash
# Start scripting session with table
dpkit table script data.csv

# Script with schema and dialect
dpkit table script data.csv --schema schema.json --dialect dialect.json

# Script resource from package
dpkit table script --from-package datapackage.json --from-resource "sales"

# In the REPL session:
dpkit> table.rows.length
dpkit> table.columns
dpkit> table.rows[0]
dpkit> table.schema.fields.map(f => f.name)
```

## Common Workflows

### Data Exploration and Analysis

1. **Quick exploration:**
   ```bash
   dpkit table explore data.csv
   ```

2. **Generate statistical summary:**
   ```bash
   dpkit table describe data.csv
   ```

3. **Interactive analysis:**
   ```bash
   dpkit table script data.csv
   ```

### Data Validation Workflow

```bash
# Infer schema from table
dpkit schema infer data.csv --json > schema.json

# Validate table against schema
dpkit table validate data.csv --schema schema.json

# Explore validation issues
dpkit table explore data.csv --schema schema.json
```

### Format Conversion Pipeline

```bash
# Convert Excel to CSV for processing
dpkit table convert input.xlsx temp.csv

# Process and validate
dpkit table validate temp.csv --schema schema.json

# Convert to final format
dpkit table convert temp.csv output.json
```

### Package Integration Workflow

```bash
# Create package with tables
dpkit package infer *.csv --json > datapackage.json

# Validate individual tables
dpkit table validate --from-package datapackage.json --from-resource "users"

# Describe tables for documentation
dpkit table describe --from-package datapackage.json --from-resource "sales" --json
```

### Remote Table Processing

```bash
# Explore remote table
dpkit table explore https://example.com/data.csv

# Convert remote to local format
dpkit table convert https://example.com/data.csv local_data.xlsx

# Validate remote table with local schema
dpkit table validate https://example.com/data.csv --schema local_schema.json
```

## Supported File Formats

### Input Formats
- **CSV/TSV**: Comma/tab-separated values with dialect support
- **Excel**: .xlsx and .xls files with sheet selection
- **JSON**: Various JSON table formats
- **Parquet**: Apache Parquet columnar format
- **Arrow**: Apache Arrow format
- **ODS**: OpenDocument Spreadsheet format

### Output Formats
- **CSV**: Standard comma-separated values
- **Excel**: .xlsx format
- **JSON**: Various JSON structures
- **Parquet**: Efficient columnar storage
- **Arrow**: High-performance analytics
- **ODS**: Cross-platform spreadsheets

## Advanced Options

### Schema-Aware Operations
```bash
# Validate with type checking
dpkit table validate data.csv --schema schema.json

# Explore with schema hints
dpkit table explore data.csv --schema schema.json
```

### Custom Parsing
```bash
# Use custom dialect for parsing
dpkit table explore data.csv --dialect custom_dialect.json

# Convert with parsing options
dpkit table convert complex_data.csv output.xlsx --dialect dialect.json
```

### Statistical Analysis
```bash
# Generate comprehensive statistics
dpkit table describe large_dataset.csv --json > stats.json

# Interactive statistical exploration
dpkit table script data.csv
# In REPL: analyze column distributions, correlations, etc.
```

## Error Handling and Debugging

### Validation Issues
```bash
# Get detailed validation report
dpkit table validate data.csv --schema schema.json --json

# Interactive error exploration (don't quit on errors)
dpkit table validate data.csv --schema schema.json
```

### Parsing Problems
```bash
# Debug parsing issues
dpkit table explore problematic.csv --debug

# Infer and test dialect
dpkit dialect infer problematic.csv --json > dialect.json
dpkit table explore problematic.csv --dialect dialect.json
```

### Performance Optimization
```bash
# For large files, use sampling
dpkit table describe huge_file.csv --sample-rows 10000

# Convert to efficient formats for repeated analysis
dpkit table convert large_data.csv data.parquet
```

## Output Formats

Table commands support multiple output formats:

- **Interactive Display**: Rich terminal interface with data previews
- **JSON**: Machine-readable structured output
- **Statistical Reports**: Comprehensive data summaries
- **Debug Mode**: Detailed operation logs and diagnostics

## Integration Examples

### With Package Commands
```bash
# Create and validate package
dpkit package infer *.csv --json > datapackage.json
dpkit table validate --from-package datapackage.json --from-resource "main"
```

### With Schema Commands
```bash
# Infer schema and validate table
dpkit schema infer data.csv --json > schema.json
dpkit table validate data.csv --schema schema.json
```

### With Dialect Commands
```bash
# Infer dialect and use for table operations
dpkit dialect infer data.csv --json > dialect.json
dpkit table explore data.csv --dialect dialect.json
```
