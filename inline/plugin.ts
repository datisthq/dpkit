import type { Resource } from "@dpkit/core"
import type { ReadTableOptions, TablePlugin } from "@dpkit/table"
import { readInlineTable } from "./table/index.js"

export class InlinePlugin implements TablePlugin {
  async readTable(resource: Resource, options?: ReadTableOptions) {
    const isInline = getIsInline(resource)
    if (!isInline) return undefined

    return await readInlineTable(resource, options)
  }
}

function getIsInline(resource: Resource) {
  return !!resource.data
}
