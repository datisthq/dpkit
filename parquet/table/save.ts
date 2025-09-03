import { assertLocalPathVacant } from "@dpkit/file"
import type { SaveTableOptions, Table } from "@dpkit/table"

export async function saveParquetTable(
  table: Table,
  options: SaveTableOptions,
) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  await table
    .sinkParquet(path, {
      maintainOrder: true,
    })
    .collect()

  return path
}
