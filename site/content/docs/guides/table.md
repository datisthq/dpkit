---
title: Table
sidebar:
  order: 7
---

Table commands help you work directly with tabular data files. These commands allow you to explore, validate, convert, and analyze data tables with support for various formats including CSV, Excel, JSON, and more.

## Available Commands

### `dp table convert`

Convert a table from one format to another with support for various input and output formats.

```bash
dp table convert <source-path> <target-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-d, --debug`: Enable debug mode

**Supported Formats:**
- **Input**: CSV, TSV, Excel (.xlsx, .xls), JSON, Parquet, Arrow, ODS
- **Output**: CSV, TSV, Excel (.xlsx), JSON, Parquet, Arrow, ODS

**Examples:**
```bash
# Convert CSV to Excel
dp table convert data.csv data.xlsx

# Convert Excel to JSON
dp table convert data.xlsx data.json

# Convert from package resource
dp table convert --from-package datapackage.json --from-resource "users" users.xlsx

# Convert Parquet to CSV
dp table convert data.parquet data.csv
```

### `dp table describe`

Generate statistical descriptions and summaries of table data including column statistics, data types, and quality metrics.

```bash
dp table describe <table-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Describe CSV file
dp table describe data.csv

# Describe with JSON output
dp table describe data.csv --json

# Describe resource from package
dp table describe --from-package datapackage.json --from-resource "sales"

# Describe remote table
dp table describe https://example.com/data.csv
```

### `dp table explore`

Explore a table interactively, viewing data samples, column information, and basic statistics in a rich terminal interface.

```bash
dp table explore <table-path>
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
dp table explore data.csv

# Explore with schema validation
dp table explore data.csv --schema schema.json

# Explore with custom dialect
dp table explore data.csv --dialect dialect.json

# Explore resource from package
dp table explore --from-package datapackage.json --from-resource "users"

# Explore remote table
dp table explore https://example.com/data.csv
```

### `dp table validate`

Validate table data against a schema, checking data types, constraints, and data quality issues.

```bash
dp table validate <table-path>
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
dp table validate data.csv --schema schema.json

# Validate with custom dialect and schema
dp table validate data.csv --dialect dialect.json --schema schema.json

# Validate resource from package
dp table validate --from-package datapackage.json --from-resource "users"

# Get validation results as JSON
dp table validate data.csv --schema schema.json --json

# Validate remote table
dp table validate https://example.com/data.csv --schema https://example.com/schema.json
```

### `dp table script`

Open an interactive scripting session with a loaded table. This provides a REPL environment where you can programmatically analyze and manipulate table data.

```bash
dp table script <table-path>
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
dp table script data.csv

# Script with schema and dialect
dp table script data.csv --schema schema.json --dialect dialect.json

# Script resource from package
dp table script --from-package datapackage.json --from-resource "sales"

# In the REPL session:
dp> table.rows.length
dp> table.columns
dp> table.rows[0]
dp> table.schema.fields.map(f => f.name)
```

## Common Workflows

### Data Exploration and Analysis

1. **Quick exploration:**
   ```bash
   dp table explore data.csv
   ```

2. **Generate statistical summary:**
   ```bash
   dp table describe data.csv
   ```

3. **Interactive analysis:**
   ```bash
   dp table script data.csv
   ```

### Data Validation Workflow

```bash
# Infer schema from table
dp schema infer data.csv --json > schema.json

# Validate table against schema
dp table validate data.csv --schema schema.json

# Explore validation issues
dp table explore data.csv --schema schema.json
```

### Format Conversion Pipeline

```bash
# Convert Excel to CSV for processing
dp table convert input.xlsx temp.csv

# Process and validate
dp table validate temp.csv --schema schema.json

# Convert to final format
dp table convert temp.csv output.json
```

### Package Integration Workflow

```bash
# Create package with tables
dp package infer *.csv --json > datapackage.json

# Validate individual tables
dp table validate --from-package datapackage.json --from-resource "users"

# Describe tables for documentation
dp table describe --from-package datapackage.json --from-resource "sales" --json
```

### Remote Table Processing

```bash
# Explore remote table
dp table explore https://example.com/data.csv

# Convert remote to local format
dp table convert https://example.com/data.csv local_data.xlsx

# Validate remote table with local schema
dp table validate https://example.com/data.csv --schema local_schema.json
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
dp table validate data.csv --schema schema.json

# Explore with schema hints
dp table explore data.csv --schema schema.json
```

### Custom Parsing
```bash
# Use custom dialect for parsing
dp table explore data.csv --dialect custom_dialect.json

# Convert with parsing options
dp table convert complex_data.csv output.xlsx --dialect dialect.json
```

### Statistical Analysis
```bash
# Generate comprehensive statistics
dp table describe large_dataset.csv --json > stats.json

# Interactive statistical exploration
dp table script data.csv
# In REPL: analyze column distributions, correlations, etc.
```

## Error Handling and Debugging

### Validation Issues
```bash
# Get detailed validation report
dp table validate data.csv --schema schema.json --json

# Interactive error exploration (don't quit on errors)
dp table validate data.csv --schema schema.json
```

### Parsing Problems
```bash
# Debug parsing issues
dp table explore problematic.csv --debug

# Infer and test dialect
dp dialect infer problematic.csv --json > dialect.json
dp table explore problematic.csv --dialect dialect.json
```

### Performance Optimization
```bash
# For large files, use sampling
dp table describe huge_file.csv --sample-rows 10000

# Convert to efficient formats for repeated analysis
dp table convert large_data.csv data.parquet
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
dp package infer *.csv --json > datapackage.json
dp table validate --from-package datapackage.json --from-resource "main"
```

### With Schema Commands
```bash
# Infer schema and validate table
dp schema infer data.csv --json > schema.json
dp table validate data.csv --schema schema.json
```

### With Dialect Commands
```bash
# Infer dialect and use for table operations
dp dialect infer data.csv --json > dialect.json
dp table explore data.csv --dialect dialect.json
```
