import type { Resource } from "@dpkit/core"
import { readAvro } from "nodejs-polars"
import { DataFrame } from "nodejs-polars"

export async function loadAvroTable(resource: Partial<Resource>) {
  if (typeof resource.path !== "string") {
    return DataFrame().lazy()
  }

  const table = readAvro(resource.path).lazy()
  return table
}
