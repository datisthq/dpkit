import type { Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { readCsvTable } from "./table/index.js"

export class CsvPlugin implements TablePlugin {
  async readTable(resource: Resource) {
    const format = inferResourceFormat(resource)
    const isCsv = ["csv", "tsv"].includes(format ?? "")
    if (!isCsv) return undefined

    return await readCsvTable(resource)
  }
}
