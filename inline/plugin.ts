import type { Resource } from "@dpkit/core"
import type { TablePlugin } from "@dpkit/table"
import { readInlineTable } from "./table/index.js"

export class InlinePlugin implements TablePlugin {
  async readTable(resource: Resource) {
    const isInline = !!resource.data
    if (!isInline) return undefined

    return await readInlineTable(resource)
  }
}
