import type { Plugin, Resource } from "@dpkit/core"
import { readInlineTable } from "./table/index.js"

export class InlinePlugin implements Plugin {
  async readTable(resource: Resource) {
    const isInline = !!resource.data
    if (!isInline) return undefined

    return await readInlineTable(resource)
  }
}
