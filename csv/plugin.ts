import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import type { ReadTableOptions } from "@dpkit/table"
import { readCsvTable } from "./table/index.js"

export class CsvPlugin implements TablePlugin {
  async readTable(resource: Resource, options?: ReadTableOptions) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await readCsvTable(resource, options)
  }
}

function getIsCsv(resource: Resource) {
  const format = inferResourceFormat(resource)
  return ["csv", "tsv"].includes(format ?? "")
}
