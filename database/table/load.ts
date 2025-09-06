import { loadResourceDialect, loadResourceSchema } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import { normalizeTable } from "@dpkit/table"
import type { LoadTableOptions } from "@dpkit/table"
import { inferSchemaFromTable } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"
import type { BaseDriver } from "../drivers/base.js"
import { MysqlDriver } from "../drivers/mysql.js"
import { PostgresDriver } from "../drivers/postgres.js"
import { SqliteDriver } from "../drivers/sqlite.js"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function loadPostgresTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  return await loadTable(resource, { ...options, driver: new PostgresDriver() })
}

export async function loadMysqlTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  return await loadTable(resource, { ...options, driver: new MysqlDriver() })
}

export async function loadSqliteTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  return await loadTable(resource, { ...options, driver: new SqliteDriver() })
}

export async function loadTable(
  resource: Partial<Resource>,
  options: LoadTableOptions & {
    driver: BaseDriver
  },
) {
  const { driver } = options

  const path = typeof resource.path === "string" ? resource.path : undefined
  if (!path) {
    throw new Error("Resource path is not defined")
  }

  const dialect = await loadResourceDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined in dialect")
  }

  const database = await driver.connectDatabase(path)
  const records = await database.selectFrom(dialect.table).selectAll().execute()
  database.destroy()

  let table = DataFrame(records).lazy()

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}
