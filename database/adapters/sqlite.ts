import type { FieldType } from "@dpkit/core"
import Database from "better-sqlite3"
import { SqliteDialect } from "kysely"
import type { DatabaseType } from "../field/index.ts"
import { BaseAdapter } from "./base.ts"

export class SqliteAdapter extends BaseAdapter {
  nativeTypes = ["integer", "number", "string", "year"] satisfies FieldType[]

  createDialect(path: string) {
    return new SqliteDialect({
      database: new Database(path.replace(/^sqlite:\/\//, "")),
    })
  }

  normalizeType(databaseType: DatabaseType): FieldType {
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

  denormalizeType(fieldType: FieldType): DatabaseType {
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
