import type { SaveTableOptions, Table } from "@dpkit/table"

export async function saveParquetTable(
  table: Table,
  options: SaveTableOptions,
) {
  const { path } = options

  await table
    .sinkParquet(path, {
      maintainOrder: true,
    })
    .collect()

  return path
}
