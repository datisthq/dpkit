import type { Dialect } from "@dpkit/core"
import { saveFile } from "@dpkit/file"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { decodeJsonBuffer, encodeJsonBuffer } from "../buffer/index.js"

export async function saveJsonTable(table: Table, options: SaveTableOptions) {
  return await saveTable(table, { ...options, isLines: false })
}

export async function saveJsonlTable(table: Table, options: SaveTableOptions) {
  return await saveTable(table, { ...options, isLines: true })
}

async function saveTable(
  table: Table,
  options: SaveTableOptions & { isLines: boolean },
) {
  const { path, dialect, isLines } = options
  const df = await table.collect()

  // We use polars to serialize the data
  // But encode it manually to support dialects/formatting
  let buffer = df.writeJSON({ format: isLines ? "lines" : "json" })
  let data = decodeJsonBuffer(buffer, { isLines })

  if (dialect) {
    data = processData(data, dialect)
  }

  buffer = encodeJsonBuffer(data, { isLines })
  await saveFile(path, buffer)

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
