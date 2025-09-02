import { loadResourceDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { MysqlDialect, PostgresDialect, SqliteDialect } from "kysely"
import type { Dialect } from "kysely"
import { createPool } from "mysql2"
import { DataFrame } from "nodejs-polars"
import { Pool } from "pg"

export async function loadPostgresTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const pool = new Pool({ connectionString: url, max: 1 })
  const adapter = new PostgresDialect({ pool })

  return await loadTable(resource, { adapter })
}

export async function loadMysqlTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const pool = createPool({ uri: url, connectionLimit: 1 })
  const adapter = new MysqlDialect({ pool })

  return await loadTable(resource, { adapter })
}

export async function loadSqliteTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const database = new Database(url)
  const adapter = new SqliteDialect({ database })

  return await loadTable(resource, { adapter })
}

export async function loadTable(
  resource: Partial<Resource>,
  options: {
    adapter: Dialect
  },
) {
  const { adapter } = options
  const db = new Kysely({ dialect: adapter })

  const dialect = await loadResourceDialect(resource.dialect)
  if (!dialect?.table) {
    throw new Error("Table name is not defined")
  }

  // @ts-ignore
  const records = await db.selectFrom(dialect.table).selectAll().execute()
  db.destroy()

  const table = DataFrame(records).lazy()
  return table
}
