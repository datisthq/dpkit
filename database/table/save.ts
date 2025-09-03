import type { Schema } from "@dpkit/core"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { inferSchema } from "@dpkit/table"
import type { Kysely } from "kysely"
import type { BaseDriver } from "../drivers/base.js"
import { MysqlDriver } from "../drivers/mysql.js"
import { PostgresDriver } from "../drivers/postgres.js"
import { SqliteDriver } from "../drivers/sqlite.js"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function savePostgresTable(table: Table, opts: SaveTableOptions) {
  return await saveTable(table, { ...opts, driver: new PostgresDriver() })
}

export async function saveMysqlTable(table: Table, opts: SaveTableOptions) {
  return await saveTable(table, { ...opts, driver: new MysqlDriver() })
}

export async function saveSqliteTable(table: Table, opts: SaveTableOptions) {
  return await saveTable(table, { ...opts, driver: new SqliteDriver() })
}

async function saveTable(
  table: Table,
  options: SaveTableOptions & { driver: BaseDriver },
) {
  const { path, dialect, driver, overwrite } = options

  const tableName = dialect?.table
  if (!tableName) {
    throw new Error("Table name is not defined in dialect")
  }

  const schema = await inferSchema(table)
  const database = await driver.connectDatabase(path)

  await defineTable(database, { driver, schema, tableName, overwrite })
}

async function defineTable(
  database: Kysely<any>,
  options: {
    driver: BaseDriver
    schema: Schema
    tableName: string
    overwrite?: boolean
  },
) {
  const { driver, schema, tableName, overwrite } = options

  let query = database.schema.createTable(tableName)

  if (!overwrite) {
    query = query.ifNotExists()
  }

  for (const field of schema.fields) {
    const sqlType = driver.convertFieldToSqlType(field)
    query = query.addColumn(field.name, sqlType)
  }

  await query.execute()
}

async function populateTable(
  database: Kysely<any>,
  options: {
    driver: BaseDriver
    schema: Schema
    tableName: string
  },
) {}
