import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { SqliteDialect } from "kysely"
import type { BaseDriver } from "./base.js"

export class SqliteDriver implements BaseDriver {
  async connectDatabase(path: string) {
    const filename = path.replace(/^sqlite:\/\//, "")
    const database = new Database(filename)

    return new Kysely<any>({
      dialect: new SqliteDialect({
        database,
      }),
    })
  }

  convertFieldToSql(field: Field) {
    switch (field.type) {
      case "string":
        return "text"
      case "integer":
        return "integer"
      case "number":
        return "numeric"
      default:
        return "text"
    }
  }

  convertRecordToSql(record: DataRecord, schema: Schema) {
    for (const field of schema.fields) {
      if (field.type === "boolean") {
        record[field.name] = record[field.name] ? "true" : "false"
      } else if (field.type === "object" || field.type === "array") {
        record[field.name] = JSON.stringify(record[field.name])
      } else if (field.type === "datetime") {
        record[field.name] = (record[field.name] as Date).toISOString()
      } else if (field.type === "date") {
        record[field.name] = (record[field.name] as Date)
          .toISOString()
          .slice(0, 10)
      } else if (field.type === "time") {
        record[field.name] = (record[field.name] as Date)
          .toISOString()
          .slice(11)
      }
    }
  }
}
