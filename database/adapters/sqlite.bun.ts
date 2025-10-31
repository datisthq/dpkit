// @ts-ignore
import { Database } from "bun:sqlite"
import { BunSqliteDialect } from "kysely-bun-sqlite"

export function createBunSqliteDialect(path: string) {
  return new BunSqliteDialect({ database: new Database(path) })
}
