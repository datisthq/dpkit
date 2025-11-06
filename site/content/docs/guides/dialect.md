---
title: Dialect
sidebar:
  order: 5
---

Table Dialect commands help you work with CSV dialects - metadata that describes how to parse CSV and similar tabular text files. These commands allow you to infer parsing parameters from files, validate dialect definitions, and explore dialect properties.

## Available Commands

### `dpkit dialect infer`

Infer a table dialect from a table by analyzing its structure and determining the best parsing parameters such as delimiter, quote character, and header configuration.

```bash
dpkit dialect infer <table-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode
- `--sample-bytes`: Number of bytes to sample for dialect inference

**Examples:**
```bash
# Infer dialect from CSV file
dpkit dialect infer data.csv

# Infer from remote file
dpkit dialect infer https://example.com/data.csv

# Infer from resource in package
dpkit dialect infer --from-package datapackage.json --from-resource "users"

# Export dialect as JSON
dpkit dialect infer data.csv --json > dialect.json

# Use larger sample for complex files
dpkit dialect infer complex_data.csv --sample-bytes 8192
```

### `dpkit dialect explore`

Explore a table dialect from a local or remote path to view its parsing configuration in an interactive format.

```bash
dpkit dialect explore <descriptor-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Explore dialect descriptor
dpkit dialect explore dialect.json

# Explore remote dialect
dpkit dialect explore https://example.com/dialect.json

# Explore dialect from package resource
dpkit dialect explore --from-package datapackage.json --from-resource "users"

# Export dialect structure as JSON
dpkit dialect explore dialect.json --json
```

### `dpkit dialect validate`

Validate a table dialect from a local or remote path against the CSV Dialect specification.

```bash
dpkit dialect validate <descriptor-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output validation results as JSON
- `-d, --debug`: Enable debug mode
- `-q, --quit`: Exit immediately after validation (don't prompt for error filtering)
- `-a, --all`: Skip selection prompts when all can be selected

**Examples:**
```bash
# Validate dialect descriptor
dpkit dialect validate dialect.json

# Validate remote dialect
dpkit dialect validate https://example.com/dialect.json

# Validate dialect from package resource
dpkit dialect validate --from-package datapackage.json --from-resource "users"

# Get validation results as JSON
dpkit dialect validate dialect.json --json

# Interactive selection when no path provided
dpkit dialect validate --from-package datapackage.json
```

### `dpkit dialect script`

Open an interactive scripting session with a loaded table dialect. This provides a REPL environment where you can programmatically interact with the dialect definition.

```bash
dpkit dialect script <descriptor-path>
```

**Options:**
- `-p, --from-package`: Path to package containing the resource
- `-r, --from-resource`: Name of resource within package
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Available Variables:**
- `dpkit`: The dpkit library object
- `dialect`: The loaded dialect object

**Examples:**
```bash
# Start scripting session with dialect
dpkit dialect script dialect.json

# Script dialect from package resource
dpkit dialect script --from-package datapackage.json --from-resource "users"

# In the REPL session:
dpkit> dialect.delimiter
dpkit> dialect.quoteChar
dpkit> dialect.header
dpkit> dialect.skipInitialSpace
```

## Common Workflows

### Creating Dialect Definitions

1. **Infer from data file:**
   ```bash
   dpkit dialect infer data.csv --json > dialect.json
   ```

2. **Validate the generated dialect:**
   ```bash
   dpkit dialect validate dialect.json
   ```

3. **Explore the dialect configuration:**
   ```bash
   dpkit dialect explore dialect.json
   ```

### Dialect Analysis for Complex Files

```bash
# Infer dialect with larger sample for better accuracy
dpkit dialect infer complex_file.csv --sample-bytes 16384

# Validate and explore for verification
dpkit dialect validate dialect.json
dpkit dialect explore dialect.json

# Script for custom dialect analysis
dpkit dialect script dialect.json
```

### Working with Package Dialects

```bash
# Validate all dialects in a package interactively
dpkit dialect validate --from-package datapackage.json

# Infer improved dialect for specific resource
dpkit dialect infer --from-package datapackage.json --from-resource "transactions"

# Compare dialects using scripting
dpkit dialect script --from-package datapackage.json --from-resource "users"
```

### Remote Dialect Handling

```bash
# Work with remote dialects
dpkit dialect explore https://example.com/dialect.json
dpkit dialect validate https://example.com/dialect.json
dpkit dialect infer https://example.com/data.csv
```

## Dialect Properties

CSV Dialect specifications typically include:

### Core Properties
- **delimiter**: Field separator character (e.g., `,`, `;`, `\t`)
- **quoteChar**: Character used to quote fields (e.g., `"`, `'`)
- **escapeChar**: Character used to escape quotes within fields
- **doubleQuote**: Whether quotes are escaped by doubling them

### Header Configuration
- **header**: Whether the first row contains headers
- **headerRows**: Number of header rows
- **headerJoin**: Character used to join multi-row headers

### Whitespace Handling
- **skipInitialSpace**: Whether to skip whitespace after delimiters
- **nullSequence**: Sequence representing null values

### Comment Handling
- **commentRows**: Number of comment rows to skip
- **commentChar**: Character indicating comment lines

## Common Dialect Patterns

### Standard CSV
```json
{
  "delimiter": ",",
  "quoteChar": "\"",
  "doubleQuote": true,
  "header": true
}
```

### European CSV (semicolon-separated)
```json
{
  "delimiter": ";",
  "quoteChar": "\"",
  "doubleQuote": true,
  "header": true
}
```

### Tab-separated values
```json
{
  "delimiter": "\t",
  "quoteChar": "\"",
  "doubleQuote": true,
  "header": true
}
```

### Custom formats with comments
```json
{
  "delimiter": "|",
  "quoteChar": "'",
  "header": true,
  "commentRows": 3,
  "commentChar": "#"
}
```

## Troubleshooting Dialect Inference

### For files with unusual formatting:
```bash
# Use larger sample size
dpkit dialect infer unusual_file.csv --sample-bytes 32768

# Check inferred dialect
dpkit dialect explore dialect.json

# Manually verify with table commands
dpkit table explore unusual_file.csv --dialect dialect.json
```

### For files with multiple header rows:
```bash
# The dialect inference will detect headerRows automatically
dpkit dialect infer multi_header.csv --json

# Verify the header configuration
dpkit dialect script dialect.json
# Then in REPL: dialect.headerRows
```

## Output Formats

All dialect commands support multiple output formats:

- **Interactive Display**: Default rich terminal interface showing dialect properties
- **JSON**: Use `--json` flag for machine-readable output
- **Debug Mode**: Use `--debug` for detailed operation logs

## Integration with Other Commands

Dialect commands work seamlessly with other dpkit commands:

```bash
# Create dialect, then use it for table operations
dpkit dialect infer data.csv --json > dialect.json
dpkit table validate data.csv --dialect dialect.json

# Work within package context
dpkit package infer *.csv --json > datapackage.json
dpkit dialect validate --from-package datapackage.json --from-resource "data"

# Use inferred dialect for schema inference
dpkit dialect infer data.csv --json > dialect.json
dpkit schema infer data.csv --delimiter ";" --header-rows 2
```

## Best Practices

1. **Sample Size**: Use larger `--sample-bytes` for files with complex or inconsistent formatting
2. **Validation**: Always validate inferred dialects before using them in production
3. **Testing**: Test dialect definitions with actual data using table commands
4. **Documentation**: Include dialect files alongside data files for reproducibility
