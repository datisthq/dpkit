import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"

export async function readCsvTable(
  resource: Partial<Resource>,
  options?: {
    sampleSize?: number
    dontProcess?: boolean
  },
) {
  console.log(resource, options)
  return DataFrame().lazy()
}
