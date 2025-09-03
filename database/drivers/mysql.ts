import { Kysely } from "kysely"
import { MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import type { DataType } from "nodejs-polars"
import { BaseDriver } from "./base.js"

export class MysqlDriver extends BaseDriver {
  async connectDatabase(path: string) {
    const pool = createPool({
      uri: path,
      connectionLimit: 1,
    })

    return new Kysely<any>({
      dialect: new MysqlDialect({
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
      case "Int64":
      case "UInt64":
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
        return "datetime"
      default:
        return "text"
    }
  }
}
