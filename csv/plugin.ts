import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { loadCsvTable } from "./table/index.js"

export class CsvPlugin implements TablePlugin {
  async loadTable(resource: Resource) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await loadCsvTable(resource)
  }
}

function getIsCsv(resource: Resource) {
  const format = inferResourceFormat(resource)
  return ["csv", "tsv"].includes(format ?? "")
}
