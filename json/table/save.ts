import type { SaveTableOptions, Table } from "@dpkit/table"

export async function saveJsonTable(_table: Table, options: SaveTableOptions) {
  // TODO: implement

  return options.path
}

export async function saveJsonlTable(table: Table, options: SaveTableOptions) {
  const df = await table.collect()

  df.writeJSON(options?.path, {
    format: "lines",
  })

  return options.path
}
