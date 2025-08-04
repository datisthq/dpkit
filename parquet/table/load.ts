import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"

export async function loadParquetTable(_resource: Partial<Resource>) {
  return DataFrame().lazy()
}
