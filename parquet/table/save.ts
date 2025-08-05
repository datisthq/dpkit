import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: so currently, nodejs-polars uses sync sink/write functions??

export async function saveParquetTable(
  table: Table,
  options: SaveTableOptions,
) {
  table.sinkParquet(options?.path, {
    maintainOrder: true,
  })

  return options.path
}
