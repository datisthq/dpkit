import type { Field } from "@dpkit/core"
import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { SqliteDialect } from "kysely"
import type { BaseDriver } from "./base.js"

export class SqliteDriver implements BaseDriver {
  async connectDatabase(path: string) {
    const database = new Database(path)

    return new Kysely<any>({
      dialect: new SqliteDialect({
        database,
      }),
    })
  }

  convertFieldToSqlType(field: Field) {
    switch (field.type) {
      case "boolean":
        return "boolean"
      case "integer":
      case "number":
        return "integer"
      case "string":
        return "text"
      case "date":
      case "time":
      case "datetime":
      case "year":
      case "yearmonth":
      case "duration":
        return "text"
      case "object":
      case "array":
      case "list":
      case "geopoint":
      case "geojson":
      case "any":
        return "text"
      default:
        return "text"
    }
  }
}
