import { assertLocalPathVacant } from "@dpkit/file"
import type { SaveTableOptions, Table } from "@dpkit/table"
import { denormalizeTable, inferTableSchema } from "@dpkit/table"

export async function saveCsvTable(
  table: Table,
  options: SaveTableOptions & { format?: "csv" | "tsv" },
) {
  const { path, format, overwrite } = options
  const isTabs = format === "tsv"

  if (!overwrite) {
    await assertLocalPathVacant(path)
  }

  const schema = await inferTableSchema(table, {
    ...options,
    keepStrings: true,
  })

  console.log(schema)
  table = await denormalizeTable(table, schema)

  await table
    .sinkCSV(path, {
      maintainOrder: true,
      includeHeader: options.dialect?.header ?? true,
      separator: options.dialect?.delimiter ?? (isTabs ? "\t" : ","),
      //lineTerminator: options.dialect?.lineTerminator ?? "\r\n",
      quoteChar: options.dialect?.quoteChar ?? '"',
    })
    .collect()

  return path
}
