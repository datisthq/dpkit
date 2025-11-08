---
title: Commands
sidebar:
  order: 2
---

After instalation, the dpkit's command-line tool is available in your terminal under name `dpkit`. Please read the [Getting Started](../../overview/getting-started) guide for more information.

## Command categories

The CLI commands are organized into categories named after the main objects they support:

- package
- resource
- dialect
- schema
- table
- file

Each category has its own commands for example the `table` category:

- `dpkit table convert`
- `dpkit table describe`
- `dpkit table explore`
- `dpkit table script`
- `dpkit table validate`

## Working with data packages

Usually non-package command support the `-p/--package` and `-r/--resource` options to specify the datapackage file path and a resource name to access an object inside a data package.

For example, we can explore a table using this command:

```bash
dpkit table explore table.csv
```

Or this command using an interactive mode:

```bash
dpkit table explore -p datapackage.json
# it will ask you to select a resource
```

Or this command using both the datapackage file path and the resource name making it non-interactive similarly to the plain path-based command:

```bash
dpkit table explore -p datapackage.json -r table
```

> [!TIP]
> When you use the `-p` option, the CLI will open any supported Data Package source including Zenodo, Ckan, and others.
