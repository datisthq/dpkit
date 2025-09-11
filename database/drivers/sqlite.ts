import type { Field, FieldType } from "@dpkit/core"
import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { type ColumnMetadata, SqliteDialect } from "kysely"
import { BaseDriver } from "./base.js"

export class SqliteDriver extends BaseDriver {
  nativeTypes = ["integer", "number", "string", "year"] satisfies FieldType[]

  async connectDatabase(path: string) {
    const filename = path.replace(/^sqlite:\/\//, "")
    const database = new Database(filename)

    return new Kysely<any>({
      dialect: new SqliteDialect({
        database,
      }),
    })
  }

  normalizeType(databaseType: ColumnMetadata["dataType"]) {
    switch (databaseType.toLowerCase()) {
      case "blob":
        return "string"
      case "text":
        return "string"
      case "integer":
        return "integer"
      case "numeric":
      case "real":
        return "number"
      default:
        return "string"
    }
  }

  denormalizeType(fieldType: Field["type"]) {
    switch (fieldType) {
      case "boolean":
        return "integer"
      case "integer":
        return "integer"
      case "number":
        return "real"
      case "string":
        return "text"
      case "year":
        return "integer"
      default:
        return "text"
    }
  }
}
