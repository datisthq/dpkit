import { MysqlDriver } from "./mysql.ts"
import { PostgresqlDriver } from "./postgresql.ts"
import { SqliteDriver } from "./sqlite.ts"

export function createDriver(format: "mysql" | "postgresql" | "sqlite") {
  switch (format) {
    case "postgresql":
      return new PostgresqlDriver()
    case "mysql":
      return new MysqlDriver()
    case "sqlite":
      return new SqliteDriver()
    default:
      return undefined
  }
}
