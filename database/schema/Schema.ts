import type { TableMetadata } from "kysely"

export interface DatabaseSchema extends TableMetadata {
  primaryKey?: string[]
}
