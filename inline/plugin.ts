import type { Resource } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { loadInlineTable } from "./table/index.ts"

export class InlinePlugin implements TablePlugin {
  async loadTable(resource: Resource) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await loadInlineTable(resource)
  }
}

function getIsInline(resource: Resource) {
  return !!resource.data
}
