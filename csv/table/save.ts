import { assertLocalPathVacant } from "@dpkit/file"
import type { SaveTableOptions, Table } from "@dpkit/table"

// TODO: support providing TSV format? (see JSON)

export async function saveCsvTable(
  table: Table,
  options: SaveTableOptions & { format?: "csv" | "tsv" },
) {
  const { path, overwrite } = options

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  await table
    .sinkCSV(path, {
      maintainOrder: true,
      includeHeader: options.dialect?.header ?? true,
      separator: options.dialect?.delimiter ?? ",",
      //lineTerminator: options.dialect?.lineTerminator ?? "\r\n",
      quoteChar: options.dialect?.quoteChar ?? '"',
    })
    .collect()

  return path
}
