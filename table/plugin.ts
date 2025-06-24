import type { Plugin, Resource } from "@dpkit/core"
import type { TableError } from "./error/index.js"
import type { Table } from "./table/index.js"

// TODO: extract ReadTableOptions and ValidateTableOptions?

export interface TablePlugin extends Plugin {
  readTable?(
    resource: Partial<Resource>,
    options?: { sampleSize?: number },
  ): Promise<Table | undefined>

  validateTable?(
    resource: Partial<Resource>,
    options?: { sampleSize?: number; invalidRowsLimit?: number },
  ): Promise<{ valid: boolean; errors: TableError[] } | undefined>
}
