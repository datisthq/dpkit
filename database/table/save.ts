import type { SaveTableOptions, Table } from "@dpkit/table"
import { denormalizeTable, inferTableSchema } from "@dpkit/table"
import type { Kysely } from "kysely"
import { createDriver } from "../drivers/create.ts"
import type { DatabaseSchema } from "../schema/index.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation
// (if not supported we can use COPY in PostgreSQL/MySQL)

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

  const schema = await inferTableSchema(table, {
    ...options,
    keepStrings: true,
  })

  table = await denormalizeTable(table, schema, {
    nativeTypes: driver.nativeTypes,
  })

  const database = await driver.connectDatabase(path)
  const databaseSchema = driver.denormalizeSchema(schema, tableName)

  await defineTable(database, databaseSchema, { overwrite })
  await populateTable(database, tableName, table)

  await database.destroy()
  return path
}

async function defineTable(
  database: Kysely<any>,
  databaseSchema: DatabaseSchema,
  options: {
    overwrite?: boolean
  },
) {
  let query = database.schema.createTable(databaseSchema.name)

  if (!options.overwrite) {
    query = query.ifNotExists()
  }

  for (const field of databaseSchema.columns) {
    // @ts-ignore
    query = query.addColumn(field.name, field.dataType)
  }

  if (databaseSchema.primaryKey) {
    query = query.addPrimaryKeyConstraint(
      `${databaseSchema.name}_pkey`,
      // @ts-ignore
      databaseSchema.primaryKey,
    )
  }

  await query.execute()
}

async function populateTable(
  database: Kysely<any>,
  tableName: string,
  table: Table,
) {
  let offset = 0
  const df = await table.collect({ streaming: true })
  while (true) {
    const buffer = df.slice(offset, offset + BUFFER_SIZE)
    offset += BUFFER_SIZE

    const records = buffer.toRecords()
    if (!records.length) {
      break
    }

    await database.insertInto(tableName).values(records).execute()
  }
}

const BUFFER_SIZE = 10_000
