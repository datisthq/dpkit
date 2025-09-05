import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import { Kysely } from "kysely"
import { MysqlDialect } from "kysely"
import { createPool } from "mysql2"
import type { BaseDriver } from "./base.js"

export class MysqlDriver implements BaseDriver {
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

  convertFieldToSql(field: Field) {
    switch (field.type) {
      case "boolean":
        return "boolean"
      case "integer":
        return "integer"
      case "number":
        return "real"
      case "string":
        return "text"
      case "date":
        return "date"
      case "time":
        return "time"
      case "datetime":
        return "datetime"
      case "year":
        return "integer"
      case "yearmonth":
      case "duration":
        return "text"
      case "object":
      case "array":
      case "list":
      case "geopoint":
      case "geojson":
        return "text"
      case "any":
        return "text"
      default:
        return "text"
    }
  }

  convertRecordToSql(_record: DataRecord, _schema: Schema) {}
}
