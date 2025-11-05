import { isLocalPathExist } from "@dpkit/file"
import type { FieldType } from "@dpkit/metadata"
import type { DatabaseType } from "../field/index.ts"
import { BaseAdapter } from "./base.ts"

// TODO: Currently, the solution is not optimal / hacky
// We need to rebase on proper sqlite dialect when it will be available
// - https://github.com/kysely-org/kysely/issues/1292
// - https://github.com/oven-sh/bun/issues/20412

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

    // @ts-ignore
    if (typeof Bun !== "undefined") {
      const { createBunSqliteDialect } = await import("./sqlite.bun.ts")
      return await createBunSqliteDialect(path)
    }

    const { createNodeSqliteDialect } = await import("./sqlite.node.ts")
    return await createNodeSqliteDialect(path)
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
