import type { Dialect, Plugin, Resource } from "@dpkit/core"
import type { ReflectTableOptions, Table } from "./table/index.ts"

export type LoadTableOptions = ReflectTableOptions & {
  sampleBytes?: number
}

export type SaveTableOptions = ReflectTableOptions & {
  path: string
  format?: string
  dialect?: Dialect
  overwrite?: boolean
}

export interface TablePlugin extends Plugin {
  loadTable?(
    resource: Partial<Resource>,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>
}
