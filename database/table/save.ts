import type { SaveTableOptions, Table } from "@dpkit/table"
import { denormalizeTable, inferSchemaFromTable } from "@dpkit/table"
import type { Kysely } from "kysely"
import { createAdapter } from "../adapters/create.ts"
import type { DatabaseSchema } from "../schema/index.ts"

// Currently, we use slow non-rust implementation as in the future
// polars-rust might be able to provide a faster native implementation
// (if not supported we can use COPY in PostgreSQL/MySQL)

export async function saveDatabaseTable(
  table: Table,
  options: SaveTableOptions & { format: "postgresql" | "mysql" | "sqlite" },
) {
  const { path, format, dialect, overwrite } = options

  const tableName = dialect?.table
  if (!tableName) {
    throw new Error("Table name is not defined in dialect")
  }

  const schema =
    options.schema ??
    (await inferSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  const adapter = createAdapter(format)
  table = await denormalizeTable(table, schema, {
    nativeTypes: adapter.nativeTypes,
  })

  const database = await adapter.connectDatabase(path, { create: true })
  const databaseSchema = adapter.denormalizeSchema(schema, tableName)

  await defineTable(database, databaseSchema, { overwrite })
  await populateTable(database, tableName, table)

  return path
}

async function defineTable(
  database: Kysely<any>,
  databaseSchema: DatabaseSchema,
  options: {
    overwrite?: boolean
  },
) {
  if (options.overwrite) {
    await database.schema.dropTable(databaseSchema.name).ifExists().execute()
  }

  let query = database.schema.createTable(databaseSchema.name)

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
