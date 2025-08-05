import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: so currently, there is not streaming method?
// TODO: so currently, nodejs-polars uses sync sink/write functions??

export async function saveArrowTable(table: Table, options: SaveTableOptions) {
  const df = await table.collect()

  df.writeIPC(options?.path)

  return options.path
}
