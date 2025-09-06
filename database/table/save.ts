import type { Schema } from "@dpkit/core"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { inferTableSchema } from "@dpkit/table"
import type { Kysely } from "kysely"
import type { BaseDriver } from "../drivers/base.js"
import { createDriver } from "../drivers/create.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation

export async function saveDatabaseTable(
  table: Table,
  options: SaveTableOptions & { format: "postgresql" | "mysql" | "sqlite" },
) {
  const { path, format, dialect, overwrite } = options

  const driver = createDriver(format)
  if (!driver) {
    throw new Error("Supported database format is not defined")
  }

  const tableName = dialect?.table
  if (!tableName) {
    throw new Error("Table name is not defined in dialect")
  }

  const schema = await inferTableSchema(table)
  const database = await driver.connectDatabase(path)

  await defineTable(database, { driver, schema, tableName, overwrite })
  await populateTable(database, { table, driver, schema, tableName })

  await database.destroy()
  return path
}

async function defineTable(
  database: Kysely<any>,
  options: {
    driver: BaseDriver
    schema: Schema
    tableName: string
    overwrite?: boolean
  },
) {
  const { driver, schema, tableName, overwrite } = options

  let query = database.schema.createTable(tableName)

  if (!overwrite) {
    query = query.ifNotExists()
  }

  for (const field of schema.fields) {
    const sqlType = driver.convertFieldToSql(field)
    query = query.addColumn(field.name, sqlType)
  }

  await query.execute()
}

async function populateTable(
  database: Kysely<any>,
  options: {
    table: Table
    driver: BaseDriver
    schema: Schema
    tableName: string
  },
) {
  const { table, driver, schema, tableName } = options

  let offset = 0
  const df = await table.collect({ streaming: true })
  while (true) {
    const buffer = df.slice(offset, offset + BUFFER_SIZE)
    offset += BUFFER_SIZE

    const records = buffer.toRecords()
    if (!records.length) {
      break
    }

    records.forEach(record => driver.convertRecordToSql(record, schema))
    await database.insertInto(tableName).values(records).execute()
  }
}

const BUFFER_SIZE = 10_000
