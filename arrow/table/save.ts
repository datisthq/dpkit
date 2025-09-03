import { assertLocalPathVacant } from "@dpkit/file"
import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: rebase on sinkIPC when it is available
// https://github.com/pola-rs/nodejs-polars/issues/353

export async function saveArrowTable(table: Table, options: SaveTableOptions) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const df = await table.collect()
  df.writeIPC(path)

  return path
}
