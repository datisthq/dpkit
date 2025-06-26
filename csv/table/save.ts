import type { Dialect } from "@dpkit/core"
import type { Table } from "@dpkit/table"

// TODO: so currently, nodejs-polars uses sync sink/write functions??

export async function saveCsvTable(
  table: Table,
  options: { path: string; dialect?: Dialect },
) {
  table.sinkCSV(options?.path, {
    maintainOrder: true,
    includeHeader: options?.dialect?.header ?? true,
    separator: options?.dialect?.delimiter ?? ",",
    //lineTerminator: options?.dialect?.lineTerminator ?? "\r\n",
    quoteChar: options?.dialect?.quoteChar ?? '"',
  })
}
