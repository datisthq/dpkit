import type { Dialect, Plugin, Resource } from "@dpkit/core"
import type { Table } from "./table/index.js"

export type InferDialectOptions = { sampleBytes?: number }

export interface TablePlugin extends Plugin {
  inferDialect?(
    resource: Partial<Resource>,
    options?: InferDialectOptions,
  ): Promise<Dialect | undefined>

  loadTable?(resource: Partial<Resource>): Promise<Table | undefined>
}
