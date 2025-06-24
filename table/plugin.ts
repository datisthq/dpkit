import type { Plugin, Resource } from "@dpkit/core"
import type { Table } from "./table/index.js"

export type ReadTableOptions = { sampleSize?: number; dontProcess?: boolean }

export interface TablePlugin extends Plugin {
  readTable?(
    resource: Partial<Resource>,
    options?: ReadTableOptions,
  ): Promise<Table | undefined>
}
