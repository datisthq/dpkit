import type { Dialect } from "@dpkit/core"
import { saveFile } from "@dpkit/file"
import { denormalizeTable, inferSchemaFromTable } from "@dpkit/table"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { decodeJsonBuffer, encodeJsonBuffer } from "../buffer/index.ts"

// TODO: rebase on sinkJSON when it is available
// https://github.com/pola-rs/nodejs-polars/issues/353

export async function saveJsonTable(
  table: Table,
  options: SaveTableOptions & { format?: "json" | "jsonl" | "ndjson" },
) {
  const { path, dialect, overwrite, format } = options
  const isLines = format === "jsonl" || format === "ndjson"

  const schema =
    options.schema ??
    (await inferSchemaFromTable(table, {
      ...options,
      keepStrings: true,
    }))

  table = await denormalizeTable(table, schema, {
    nativeTypes: ["boolean", "integer", "list", "number", "string", "year"],
  })

  // We use polars to serialize the data
  // But encode it manually to support dialects/formatting
  const frame = await table.collect()
  let buffer = frame.writeJSON({ format: isLines ? "lines" : "json" })
  let data = decodeJsonBuffer(buffer, { isLines })

  if (dialect) {
    data = processData(data, dialect)
  }

  buffer = encodeJsonBuffer(data, { isLines })
  await saveFile(path, buffer, { overwrite })

  return path
}

function processData(records: Record<string, any>[], dialect: Dialect) {
  let data: any = records

  if (dialect.itemKeys) {
    const keys = dialect.itemKeys
    data = data.map((row: any) =>
      Object.fromEntries(keys.map((key: any) => [key, row[key]])),
    )
  }

  if (dialect.itemType === "array") {
    const keys = dialect.itemKeys ?? Object.keys(data[0])
    data = [keys, ...data.map((row: any) => keys.map((key: any) => row[key]))]
  }

  if (dialect.property) {
    data = { [dialect.property]: data }
  }

  return data
}
