import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { readCsvTable, validateCsvTable } from "./table/index.js"

export class CsvPlugin implements TablePlugin {
  async readTable(resource: Resource, options?: { sampleSize?: number }) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await readCsvTable(resource, options)
  }

  async validateTable(
    resource: Resource,
    options?: { sampleSize?: number; invalidRowsLimit?: number },
  ) {
    const isCsv = getIsCsv(resource)
    if (!isCsv) return undefined

    return await validateCsvTable(resource, options)
  }
}

function getIsCsv(resource: Resource) {
  const format = inferResourceFormat(resource)
  return ["csv", "tsv"].includes(format ?? "")
}
