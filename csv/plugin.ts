import type { Plugin, Resource } from "@dpkit/core"
import { inferResourceFormat } from "@dpkit/core"
import { readCsvTable } from "./table/index.js"

export class CsvPlugin implements Plugin {
  async readTable(resource: Resource) {
    const format = inferResourceFormat(resource)
    const isCsv = ["csv", "tsv"].includes(format ?? "")
    if (!isCsv) return undefined

    return await readCsvTable(resource)
  }
}
