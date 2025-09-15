import type { Dialect, Plugin, Resource, Schema } from "@dpkit/core"
import type { DialectOptions, InferDialectOptions } from "./dialect/index.ts"
import type { InferSchemaOptions, SchemaOptions } from "./schema/index.ts"
import type { Table } from "./table/index.ts"

export type LoadTableOptions = InferDialectOptions &
  InferSchemaOptions & {
    denormalized?: boolean
  }

export type SaveTableOptions = DialectOptions &
  SchemaOptions & {
    path: string
    format?: string
    dialect?: Dialect
    schema?: Schema
    overwrite?: boolean
  }

export interface TablePlugin extends Plugin {
  inferDialect?(
    resource: Partial<Resource>,
    options?: InferDialectOptions,
  ): Promise<Dialect | undefined>

  inferSchema?(
    resource: Partial<Resource>,
    options?: InferSchemaOptions,
  ): Promise<Schema | undefined>

  loadTable?(
    resource: Partial<Resource>,
    options?: LoadTableOptions,
  ): Promise<Table | undefined>

  saveTable?(
    table: Table,
    options: SaveTableOptions,
  ): Promise<string | undefined>
}
