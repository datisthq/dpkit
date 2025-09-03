import { loadResourceDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import type { BaseDriver } from "../drivers/base.js"
import { MysqlDriver } from "../drivers/mysql.js"
import { PostgresDriver } from "../drivers/postgres.js"
import { SqliteDriver } from "../drivers/sqlite.js"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadPostgresTable(resource: Partial<Resource>) {
  return await loadTable(resource, { driver: new PostgresDriver() })
}

export async function loadMysqlTable(resource: Partial<Resource>) {
  return await loadTable(resource, { driver: new MysqlDriver() })
}

export async function loadSqliteTable(resource: Partial<Resource>) {
  return await loadTable(resource, { driver: new SqliteDriver() })
}

export async function loadTable(
  resource: Partial<Resource>,
  options: {
    driver: BaseDriver
  },
) {
  const { driver } = options

  const path = typeof resource.path === "string" ? resource.path : undefined
  if (!path) {
    return DataFrame().lazy()
  }

  const dialect = await loadResourceDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const database = await driver.connectDatabase(path)
  const records = await database.selectFrom(dialect.table).selectAll().execute()
  database.destroy()

  const table = DataFrame(records).lazy()
  return table
}
