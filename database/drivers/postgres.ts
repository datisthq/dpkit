import { Kysely } from "kysely"
import { PostgresDialect } from "kysely"
import type { DataType } from "nodejs-polars"
import { Pool } from "pg"
import { BaseDriver } from "./base.js"

export class PostgresDriver extends BaseDriver {
  async connectDatabase(path: string) {
    const pool = new Pool({
      connectionString: path,
      max: 1,
    })

    return new Kysely<any>({
      dialect: new PostgresDialect({
        pool,
      }),
    })
  }

  convertTypeFromPolarsToSql(polarsType: DataType) {
    switch (polarsType.variant) {
      case "Bool":
        return "boolean"
      case "Int8":
      case "UInt8":
      case "Int16":
      case "UInt16":
        return "smallint"
      case "Int32":
      case "UInt32":
        return "integer"
      case "UInt64":
      case "Int64":
        return "bigint"
      case "Float32":
        return "real"
      case "Float64":
        return "double precision"
      case "String":
        return "text"
      case "Date":
        return "date"
      case "Datetime":
        return "timestamp"
      default:
        return "text"
    }
  }
}
