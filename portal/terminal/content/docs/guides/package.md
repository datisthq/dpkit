---
title: Package
sidebar:
  order: 3
---

Data Package commands help you work with Data Packages - collections of data files along with their metadata. These commands allow you to create, validate, explore, and publish data packages across various platforms.

## Available Commands

### `dpkit package copy`

Copy a local or remote Data Package to a local folder, a ZIP archive or a database.

```bash
dpkit package copy <descriptor-path> --to-path <target>
```

**Options:**
- `--to-path` (required): Target destination for the copy
- `--with-remote`: Include remote resources in the copy
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Copy package to local directory
dpkit package copy datapackage.json --to-path ./output

# Copy package to ZIP archive
dpkit package copy datapackage.json --to-path package.zip

# Copy remote package including remote resources
dpkit package copy https://example.com/datapackage.json --to-path ./local --with-remote
```

### `dpkit package infer`

Infer a data package from local or remote file paths. This command analyzes data files and automatically generates metadata including schema information.

```bash
dpkit package infer <file-paths...>
```

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
# Infer package from CSV files
dpkit package infer data1.csv data2.csv

# Infer with custom delimiter
dpkit package infer data.csv --delimiter ";"

# Infer from remote files
dpkit package infer https://example.com/data.csv
```

### `dpkit package explore`

Explore a Data Package descriptor to view its structure and metadata in an interactive format.

```bash
dpkit package explore <descriptor-path>
```

**Options:**
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Explore local package
dpkit package explore datapackage.json

# Explore remote package
dpkit package explore https://example.com/datapackage.json

# Export structure as JSON
dpkit package explore datapackage.json --json
```

### `dpkit package validate`

Validate a data package from a local or remote path against the Data Package specification.

```bash
dpkit package validate <descriptor-path>
```

**Options:**
- `--json`: Output validation results as JSON
- `-d, --debug`: Enable debug mode
- `-q, --quit`: Exit immediately after validation (don't prompt for error filtering)
- `-a, --all`: Skip selection prompts when all can be selected

**Examples:**
```bash
# Validate local package
dpkit package validate datapackage.json

# Validate remote package
dpkit package validate https://example.com/datapackage.json

# Get validation results as JSON
dpkit package validate datapackage.json --json
```

### `dpkit package script`

Open an interactive scripting session with a loaded Data Package. This provides a REPL environment where you can programmatically interact with the package data.

```bash
dpkit package script <descriptor-path>
```

**Available Variables:**
- `dpkit`: The dpkit library object
- `dataPackage`: The loaded data package object

**Examples:**
```bash
# Start scripting session
dpkit package script datapackage.json

# In the REPL session:
dpkit> dataPackage.resources.length
dpkit> dataPackage.resources[0].schema.fields
```

### `dpkit package publish`

Publish data packages to various platforms. This is a parent command with platform-specific subcommands.

#### `dpkit package publish ckan`

Publish a data package to a CKAN instance.

```bash
dpkit package publish ckan <descriptor-path>
```

**CKAN Options:**
- `--to-ckan-api-key`: CKAN API key for authentication
- `--to-ckan-url`: CKAN instance URL
- `--to-ckan-owner-org`: Organization to publish under
- `--to-ckan-dataset-name`: Name for the dataset

**Examples:**
```bash
# Publish to CKAN
dpkit package publish ckan datapackage.json \
  --to-ckan-url https://demo.ckan.org \
  --to-ckan-api-key your-api-key \
  --to-ckan-owner-org your-org
```

#### `dpkit package publish github`

Publish a data package to GitHub as releases or repository files.

```bash
dpkit package publish github <descriptor-path>
```

#### `dpkit package publish zenodo`

Publish a data package to Zenodo for academic archiving.

```bash
dpkit package publish zenodo <descriptor-path>
```

## Common Workflows

### Creating a New Package

1. **Infer from data files:**
   ```bash
   dpkit package infer *.csv --json > datapackage.json
   ```

2. **Validate the generated package:**
   ```bash
   dpkit package validate datapackage.json
   ```

3. **Explore the package structure:**
   ```bash
   dpkit package explore datapackage.json
   ```

### Working with Remote Packages

```bash
# Explore remote package
dpkit package explore https://example.com/datapackage.json

# Copy remote package locally
dpkit package copy https://example.com/datapackage.json --to-path ./local-copy

# Validate remote package
dpkit package validate https://example.com/datapackage.json
```

### Publishing Workflow

```bash
# Validate before publishing
dpkit package validate datapackage.json

# Publish to CKAN
dpkit package publish ckan datapackage.json \
  --to-ckan-url https://your-ckan-instance.org \
  --to-ckan-api-key $CKAN_API_KEY
```

## Output Formats

Most commands support multiple output formats:

- **Interactive Display**: Default rich terminal interface
- **JSON**: Use `--json` flag for machine-readable output
- **Debug Mode**: Use `--debug` for detailed operation logs
