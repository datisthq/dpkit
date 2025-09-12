---
title: Working with Database
sidebar:
  label: Database
  order: 5
---
Database connectivity and operations with support for SQLite, PostgreSQL, and MySQL through Kysely query builder integration.

## Introduction

:::tip
You can use `loadTable` and `saveTable` from `@dpkit/all` instead of `@dpkit/database` to load and save database tables if the framework can infer the database connection format.
:::

The Database plugin is a part of the [dpkit](https://github.com/datisthq/dpkit) ecosystem providing these capabilities:

- `loadDatabaseTable`
- `saveDatabaseTable`
- `inferDatabaseSchema`
- `loadPackageFromDatabase`

For example:

```typescript
import { loadDatabaseTable } from "@dpkit/database"

const table = await loadDatabaseTable({
  path: "sqlite://database.db",
  dialect: { table: "users" }
})
// field types will be automatically inferred from database schema
// or you can provide a Table Schema
```

:::tip
The ouput of `loadDatabaseTable` is a Polars LazyDataFrame, allowing you to use all of the power of Polars for data processing.
:::

## Supported Databases

The plugin supports three database types:

- **SQLite** - File-based database (`sqlite://path/to/file.db`)
- **PostgreSQL** - Network database (`postgresql://user:pass@host:port/db`)
- **MySQL** - Network database (`mysql://user:pass@host:port/db`)

## Connection Formats

Database connections are specified using standard connection strings:

```typescript
// SQLite
const sqliteTable = await loadDatabaseTable({
  path: "sqlite://data.db",
  dialect: { table: "products" }
})

// PostgreSQL
const pgTable = await loadDatabaseTable({
  path: "postgresql://user:password@localhost:5432/mydb",
  dialect: { table: "orders" }
})

// MySQL
const mysqlTable = await loadDatabaseTable({
  path: "mysql://user:password@localhost:3306/mydb",
  dialect: { table: "customers" }
})
```

## Schema Inference

The database adapter automatically infers Table Schema from database table definitions:

```typescript
import { inferDatabaseSchema } from "@dpkit/database"

const schema = await inferDatabaseSchema({
  path: "sqlite://shop.db",
  dialect: { table: "products" }
})
// Returns a Table Schema with field types matching database columns
```

## Package Loading

Load entire Data Packages from databases:

```typescript
import { loadPackageFromDatabase } from "@dpkit/database"

const package = await loadPackageFromDatabase("sqlite://catalog.db")
// Loads all tables as package resources
```

## Database Adapters

The plugin uses database-specific adapters built on Kysely:

- **BaseAdapter** - Common functionality for all databases
- **SqliteAdapter** - SQLite-specific operations using better-sqlite3
- **PostgreSQLAdapter** - PostgreSQL operations using pg driver
- **MySQLAdapter** - MySQL operations using mysql2 driver

Each adapter handles:
- Type normalization between database and Table Schema types
- Connection management with LRU caching
- Database-specific SQL dialect handling
