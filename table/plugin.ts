import type { Dialect, Plugin, Resource } from "@dpkit/core"
import type { ReflectTableOptions, Table } from "./table/index.ts"

export type InferDialectOptions = {
  sampleBytes?: number
}

export type LoadTableOptions = ReflectTableOptions & {
  sampleBytes?: number
  denormalized?: boolean
}

export type SaveTableOptions = ReflectTableOptions & {
  path: string
  format?: string
  dialect?: Dialect
  overwrite?: boolean
}

export interface TablePlugin extends Plugin {
  inferDialect?(
    resource: Partial<Resource>,
    options?: InferDialectOptions,
  ): Promise<Dialect | undefined>

  loadTable?(
    resource: Partial<Resource>,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>
}
