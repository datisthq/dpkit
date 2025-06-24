import type { Resource } from "@dpkit/core"
import type { ReadTableOptions } from "@dpkit/table"
import { DataFrame } from "nodejs-polars"

export async function readCsvTable(
  resource: Partial<Resource>,
  options?: ReadTableOptions,
) {
  console.log(resource, options)
  return DataFrame().lazy()
}
