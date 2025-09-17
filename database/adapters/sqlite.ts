import { DatabaseSync } from "node:sqlite"
import type { FieldType } from "@dpkit/core"
import { isLocalPathExist } from "@dpkit/file"
import { buildQueryFn, parseBigInt } from "kysely-generic-sqlite"
import { GenericSqliteDialect } from "kysely-generic-sqlite"
import type { IGenericSqlite } from "kysely-generic-sqlite"
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

    return new GenericSqliteDialect(() =>
      createSqliteExecutor(new DatabaseSync(path)),
    )
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

// https://github.com/kysely-org/kysely/issues/1292#issuecomment-2670341588
function createSqliteExecutor(db: DatabaseSync): IGenericSqlite<DatabaseSync> {
  const getStmt = (sql: string) => {
    const stmt = db.prepare(sql)
    // We change it from original to use plain numbers
    // stmt.setReadBigInts(true)
    return stmt
  }

  return {
    db,
    query: buildQueryFn({
      all: (sql, parameters = []) =>
        getStmt(sql)
          .all(...parameters)
          // We change it from original to make it work
          // (by default it returns object with null prototype which breaks polars)
          .map(row => ({ ...row })),
      run: (sql, parameters = []) => {
        const { changes, lastInsertRowid } = getStmt(sql).run(...parameters)
        return {
          insertId: parseBigInt(lastInsertRowid),
          numAffectedRows: parseBigInt(changes),
        }
      },
    }),
    close: () => db.close(),
    iterator: (isSelect, sql, parameters = []) => {
      if (!isSelect) {
        throw new Error("Only support select in stream()")
      }
      return (
        getStmt(sql)
          .iterate(...parameters)
          // We change it from original to make it work
          // (by default it returns object with null prototype which breaks polars)
          .map(row => ({ ...row })) as any
      )
    },
  }
}
