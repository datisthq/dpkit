import type { Plugin, Resource } from "@dpkit/core"
import type { Table } from "./table/index.js"

export interface TablePlugin extends Plugin {
  loadTable?(resource: Partial<Resource>): Promise<Table | undefined>
}
