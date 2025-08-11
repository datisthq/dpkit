import type { Dialect, Plugin, Resource } from "@dpkit/core"
import type { Table } from "./table/index.ts"

export type InferDialectOptions = { sampleBytes?: number }
export type SaveTableOptions = {
  path: string
  format?: string
  dialect?: Dialect
}

export interface TablePlugin extends Plugin {
  inferDialect?(
    resource: Partial<Resource>,
    options?: InferDialectOptions,
  ): Promise<Dialect | undefined>

  loadTable?(resource: Partial<Resource>): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>
}
