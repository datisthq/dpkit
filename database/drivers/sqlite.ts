import type { Field, FieldType, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import Database from "better-sqlite3"
import { Kysely } from "kysely"
import { type ColumnMetadata, SqliteDialect } from "kysely"
import { BaseDriver } from "./base.js"

export class SqliteDriver extends BaseDriver {
  nativeTypes = ["string", "integer", "number"] satisfies FieldType[]

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
      case "text":
        return "string"
      case "integer":
        return "integer"
      case "real":
      case "numeric":
        return "number"
      case "blob":
        return "string"
      default:
        return "string"
    }
  }

  denormalizeType(fieldType: Field["type"]) {
    switch (fieldType) {
      case "string":
        return "text"
      case "integer":
        return "integer"
      case "number":
        return "real"
      case "boolean":
        return "integer"
      default:
        return "text"
    }
  }
}
