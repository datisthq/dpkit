---
title: File
sidebar:
  order: 8
---

File commands help you work with individual files, providing utilities for copying, describing, and validating files of various formats. These commands are useful for file-level operations and diagnostics.

## Available Commands

### `dpkit file copy`

Copy a file from one location to another with support for local and remote sources and destinations.

```bash
dpkit file copy <source-path> <target-path>
```

**Options:**
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Copy local file
dpkit file copy data.csv backup.csv

# Copy remote file to local
dpkit file copy https://example.com/data.csv local_data.csv

# Copy to different directory
dpkit file copy data.csv ./backup/data_backup.csv
```

### `dpkit file describe`

Describe a file's properties including size, format, encoding, and basic metadata information.

```bash
dpkit file describe <file-path>
```

**Options:**
- `-j, --json`: Output as JSON
- `-d, --debug`: Enable debug mode

**Examples:**
```bash
# Describe local file
dpkit file describe data.csv

# Describe remote file
dpkit file describe https://example.com/data.csv

# Get description as JSON
dpkit file describe data.csv --json

# Describe various file types
dpkit file describe document.pdf
dpkit file describe image.png
dpkit file describe archive.zip
```

### `dpkit file validate`

Validate a file's integrity, format compliance, and accessibility.

```bash
dpkit file validate <file-path>
```

**Options:**
- `--json`: Output validation results as JSON
- `-d, --debug`: Enable debug mode
- `-q, --quit`: Exit immediately after validation (don't prompt for error filtering)
- `-a, --all`: Skip selection prompts when all can be selected

**Examples:**
```bash
# Validate local file
dpkit file validate data.csv

# Validate remote file
dpkit file validate https://example.com/data.csv

# Get validation results as JSON
dpkit file validate data.csv --json

# Validate multiple file types
dpkit file validate document.json
dpkit file validate image.jpg
dpkit file validate data.parquet
```

## Common Workflows

### File Backup and Migration

```bash
# Create backup copy
dpkit file copy important_data.csv backup/important_data_$(date +%Y%m%d).csv

# Validate backup integrity
dpkit file validate backup/important_data_20240101.csv

# Describe backup properties
dpkit file describe backup/important_data_20240101.csv
```

### Remote File Handling

```bash
# Download and validate remote file
dpkit file copy https://example.com/dataset.csv local_dataset.csv
dpkit file validate local_dataset.csv

# Describe remote file without downloading
dpkit file describe https://example.com/dataset.csv
```

### File Diagnostics

```bash
# Check file properties
dpkit file describe suspicious_file.csv

# Validate file integrity
dpkit file validate suspicious_file.csv

# Get detailed diagnostics as JSON
dpkit file describe problematic_file.csv --json
dpkit file validate problematic_file.csv --json
```

### Batch File Operations

```bash
# Describe multiple files
for file in *.csv; do
  echo "Describing $file:"
  dpkit file describe "$file"
  echo "---"
done

# Validate all files in directory
for file in data/*.json; do
  dpkit file validate "$file" --json >> validation_report.json
done
```

## File Type Support

File commands work with various file formats:

### Data Formats
- **CSV/TSV**: Comma and tab-separated values
- **JSON**: JavaScript Object Notation
- **Excel**: .xlsx and .xls files
- **Parquet**: Apache Parquet files
- **Arrow**: Apache Arrow files
- **ODS**: OpenDocument Spreadsheet

### Archive Formats
- **ZIP**: Compressed archives
- **TAR**: Tape archives
- **GZ**: Gzip compressed files

### Document Formats
- **PDF**: Portable Document Format
- **XML**: Extensible Markup Language
- **YAML**: YAML Ain't Markup Language

### Image Formats
- **PNG**: Portable Network Graphics
- **JPEG/JPG**: Joint Photographic Experts Group
- **SVG**: Scalable Vector Graphics

## File Information Retrieved

### Basic Properties
- **Size**: File size in bytes
- **Format**: Detected file format and MIME type
- **Encoding**: Text encoding (for text files)
- **Permissions**: File access permissions (local files)

### Content Analysis
- **Structure**: Basic structure analysis for supported formats
- **Validity**: Format compliance checking
- **Metadata**: Embedded metadata extraction

### Remote File Properties
- **Accessibility**: Whether the remote file is accessible
- **Headers**: HTTP headers for remote files
- **Redirects**: Information about URL redirections

## Error Handling

### Common Issues and Solutions

#### File Not Found
```bash
dpkit file describe missing_file.csv
# Error: File not found
# Solution: Check file path and permissions
```

#### Network Issues (Remote Files)
```bash
dpkit file copy https://unreachable.com/data.csv local.csv
# Error: Network timeout
# Solution: Check URL and network connectivity
```

#### Format Recognition
```bash
dpkit file describe unknown_format.dat
# May show limited information for unknown formats
# Solution: Use --debug for more details
```

#### Permission Issues
```bash
dpkit file copy protected_file.csv backup.csv
# Error: Permission denied
# Solution: Check file permissions
```

## Advanced Usage

### Scripting and Automation
```bash
#!/bin/bash
# File processing script

FILES="*.csv"
for file in $FILES; do
  echo "Processing $file"

  # Validate file
  if dpkit file validate "$file" --json | jq -r '.valid' | grep -q "true"; then
    echo "✓ $file is valid"

    # Create backup
    dpkit file copy "$file" "backup/${file%.csv}_$(date +%Y%m%d).csv"

    # Get file info
    dpkit file describe "$file" --json > "info/${file%.csv}_info.json"
  else
    echo "✗ $file is invalid"
  fi
done
```

### Integration with Other Commands
```bash
# Validate file before processing with table commands
dpkit file validate data.csv && dpkit table explore data.csv

# Describe file and then infer schema
dpkit file describe data.csv
dpkit schema infer data.csv --json > schema.json

# Copy and then create package
dpkit file copy remote_data.csv local_data.csv
dpkit package infer local_data.csv --json > datapackage.json
```

### Monitoring and Logging
```bash
# Create validation log
dpkit file validate data.csv --json | jq '{file: "data.csv", valid: .valid, timestamp: now}' >> validation.log

# Monitor file changes
while true; do
  dpkit file describe changing_file.csv --json > current_state.json
  if ! cmp -s current_state.json previous_state.json; then
    echo "File changed at $(date)"
    cp current_state.json previous_state.json
  fi
  sleep 60
done
```

## Output Formats

File commands support multiple output formats:

- **Human-readable**: Default formatted output for terminal viewing
- **JSON**: Machine-readable structured output with `--json` flag
- **Debug**: Detailed diagnostic information with `--debug` flag

## Best Practices

1. **Validation First**: Always validate files before processing them with other commands
2. **Backup Important Files**: Use `copy` command to create backups before modifications
3. **Remote File Handling**: Describe remote files before downloading to check size and format
4. **Error Checking**: Use JSON output for programmatic error checking and handling
5. **Documentation**: Use `describe` to document file properties for reproducibility

## Security Considerations

- Remote file operations follow URL protocols and security restrictions
- Local file operations respect system file permissions
- Validation helps identify potentially corrupted or malicious files
- Debug mode may expose sensitive file system information
