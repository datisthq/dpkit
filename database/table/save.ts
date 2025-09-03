import type { SaveTableOptions, Table } from "@dpkit/table"
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

  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const database = await driver.connectDatabase(path)
}
