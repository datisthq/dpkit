import type { FieldType } from "@dpkit/core"
import { isLocalPathExist } from "@dpkit/file"
import { SqliteDialect } from "kysely"
import { Database } from "libsql/promise"
import type { DatabaseType } from "../field/index.ts"
import { BaseAdapter } from "./base.ts"

export class SqliteAdapter extends BaseAdapter {
  nativeTypes = ["integer", "number", "string", "year"] satisfies FieldType[]

  async createDialect(path: string, options?: { create?: boolean }) {
    path = path.replace(/^sqlite:\/\//, "")

    if (!options?.create) {
      const isExist = await isLocalPathExist(path)
      if (!isExist) {
        throw new Error(`Database file "${path}" does not exist`)
      }
    }

    return new SqliteDialect({
      // @ts-ignore
      database: new Database(path),
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
