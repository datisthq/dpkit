import { loadResourceDialect } from "@dpkit/core"
import type { Resource } from "@dpkit/core"
import type { DataRow, Table } from "@dpkit/table"
import { getRecordsFromRows } from "@dpkit/table"
import { PostgresDialect } from "kysely"
import type { Dialect } from "kysely"
import { Pool } from "pg"

import { DataFrame, concat } from "nodejs-polars"

export async function loadPostgresTable(resource: Partial<Resource>) {}

export async function loadMysqlTable(resource: Partial<Resource>) {}

export async function loadSqliteTable(resource: Partial<Resource>) {}

export async function loadTable(
  resource: Partial<Resource>,
  options: {
    dialect: Dialect
  },
) {}
