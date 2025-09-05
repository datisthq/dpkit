import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import { Kysely } from "kysely"
import { PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { BaseDriver } from "./base.js"

export class PostgresDriver implements BaseDriver {
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

  convertFieldToSql(field: Field) {
    switch (field.type) {
      case "boolean":
        return "boolean"
      case "integer":
        return "integer"
      case "number":
        return "double precision"
      case "string":
        return "text"
      case "date":
        return "date"
      case "time":
        return "time"
      case "datetime":
        return "datetime"
      case "year":
      case "yearmonth":
      case "duration":
        return "text"
      case "object":
      case "array":
      case "list":
        return "jsonb"
      case "geopoint":
      case "geojson":
        return "json"
      case "any":
        return "text"
      default:
        return "text"
    }
  }

  convertRecordToSql(_record: DataRecord, _schema: Schema) {}
}
