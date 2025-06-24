import type { Plugin, Resource } from "@dpkit/core"
import type { TableError } from "./error/index.js"
import type { Table } from "./table/index.js"

export interface TablePlugin extends Plugin {
  readTable?(resource: Partial<Resource>): Promise<Table | undefined>

  validateTable?(
    resource: Partial<Resource>,
  ): Promise<{ valid: boolean; errors: TableError[] } | undefined>
}
