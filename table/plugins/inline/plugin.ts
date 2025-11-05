import type { Resource } from "@dpkit/core"
import type { LoadTableOptions, TablePlugin } from "../../plugin.ts"
import { loadInlineTable } from "./table/index.ts"

export class InlinePlugin implements TablePlugin {
  async loadTable(resource: Resource, options?: LoadTableOptions) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await loadInlineTable(resource, options)
  }
}

function getIsInline(resource: Resource) {
  const isTable = resource.type === "table" || !!resource.schema
  return isTable && !!resource.data
}
