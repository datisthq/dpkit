import { DatabaseSync } from "node:sqlite"
import { buildQueryFn, parseBigInt } from "kysely-generic-sqlite"
import { GenericSqliteDialect } from "kysely-generic-sqlite"
import type { IGenericSqlite } from "kysely-generic-sqlite"

export function createNodeSqliteDialect(path: string) {
  return new GenericSqliteDialect(() =>
    createSqliteExecutor(new DatabaseSync(path)),
  )
}

function createSqliteExecutor(db: DatabaseSync): IGenericSqlite<DatabaseSync> {
  const getStmt = (sql: string) => {
    const stmt = db.prepare(sql)
    // We change it from original to use plain numbers
    //stmt.setReadBigInts(true)
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
          .iterate(...parameters) // We change it from original to make it work
          // (by default it returns object with null prototype which breaks polars)
          .map(row => ({ ...row })) as any
      )
    },
  }
}
