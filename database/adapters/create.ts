import type { DatabaseFormat } from "../resource/index.ts"
import { MysqlAdapter } from "./mysql.ts"
import { PostgresqlAdapter } from "./postgresql.ts"
import { SqliteAdapter } from "./sqlite.ts"

export function createAdapter(format: DatabaseFormat) {
  switch (format) {
    case "postgresql":
      return new PostgresqlAdapter()
    case "mysql":
      return new MysqlAdapter()
    case "sqlite":
      return new SqliteAdapter()
    default:
      throw new Error(`Unsupported database format: "${format}"`)
  }
}
