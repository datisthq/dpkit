import type { SavePackageOptions } from "@dpkit/dataset"
import type { DatasetPlugin } from "@dpkit/dataset"
import type { Dialect, Package, Resource, Schema } from "@dpkit/metadata"
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

export interface TablePlugin extends DatasetPlugin {
  savePackage?(
    dataPackage: Package,
    options: SavePackageOptions & { plugins?: TablePlugin[] },
  ): Promise<{ path?: string } | undefined>

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
