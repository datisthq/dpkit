import Database from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"

// We intentionally don't use dpkit's function here to isolate the tests

export async function readTestData(
  path: string,
  options: { tableName: string },
) {
  const db = new Kysely({
    dialect: new SqliteDialect({ database: new Database(path) }),
  })

  // @ts-ignore
  return await db.selectFrom(options.tableName).selectAll().execute()
}

export async function writeTestData(
  path: string,
  rows: unknown[][],
  options: { tableName: string },
) {
  const db = new Kysely({
    dialect: new SqliteDialect({ database: new Database(path) }),
  })

  // @ts-ignore
  await db.insertInto(options.tableName).values(rows).execute()
}
