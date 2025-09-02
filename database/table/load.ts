import { loadResourceDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import type { DataRow, Table } from "@dpkit/table"
import { getRecordsFromRows } from "@dpkit/table"
import Database from "better-sqlite3"
import { MysqlDialect, PostgresDialect, SqliteDialect } from "kysely"
import type { Dialect } from "kysely"
import { createPool } from "mysql2"
import { Pool } from "pg"

export async function loadPostgresTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const pool = new Pool({ connectionString: url, max: 1 })
  const dialect = new PostgresDialect({ pool })

  return await loadTable(resource, { dialect })
}

export async function loadMysqlTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const pool = createPool({ uri: url, connectionLimit: 1 })
  const dialect = new MysqlDialect({ pool })

  return await loadTable(resource, { dialect })
}

export async function loadSqliteTable(resource: Partial<Resource>) {
  const url = typeof resource.path === "string" ? resource.path : undefined

  const database = new Database(url)
  const dialect = new SqliteDialect({ database })

  return await loadTable(resource, { dialect })
}

export async function loadTable(
  resource: Partial<Resource>,
  options: {
    dialect: Dialect
  },
) {}
