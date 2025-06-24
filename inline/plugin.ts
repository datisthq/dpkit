import type { Resource } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { readInlineTable, validateInlineTable } from "./table/index.js"

export class InlinePlugin implements TablePlugin {
  async readTable(resource: Resource, options?: { sampleSize?: number }) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await readInlineTable(resource, options)
  }

  async validateTable(
    resource: Resource,
    options?: { sampleSize?: number; invalidRowsLimit?: number },
  ) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await validateInlineTable(resource, options)
  }
}

function getIsInline(resource: Resource) {
  return !!resource.data
}
