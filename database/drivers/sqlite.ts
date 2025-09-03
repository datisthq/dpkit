import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { SqliteDialect } from "kysely"
import type { DataType } from "nodejs-polars"
import { BaseDriver } from "./base.js"

export class SqliteDriver extends BaseDriver {
  async connectDatabase(path: string) {
    const database = new Database(path)

    return new Kysely<any>({
      dialect: new SqliteDialect({
        database,
      }),
    })
  }

  convertTypeFromPolarsToSql(polarsType: DataType) {
    switch (polarsType.variant) {
      case "Bool":
        return "boolean"
      case "Int8":
      case "Int16":
      case "Int32":
      case "Int64":
      case "UInt8":
      case "UInt16":
      case "UInt32":
      case "UInt64":
        return "integer"
      case "Float32":
      case "Float64":
        return "real"
      case "String":
        return "text"
      case "Date":
      case "Datetime":
        return "text"
      default:
        return "text"
    }
  }
}
