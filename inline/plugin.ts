import type { Resource } from "@dpkit/core"
import type { LoadTableOptions } from "@dpkit/table"
import type { TablePlugin } from "@dpkit/table"
import { loadInlineTable } from "./table/index.ts"

export class InlinePlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await loadInlineTable(resource, options)
  }
}

function getIsInline(resource: Resource) {
  return !!resource.data
}
