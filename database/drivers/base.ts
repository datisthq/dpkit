import type { Field } from "@dpkit/core"
import type { ColumnDataType, Kysely } from "kysely"

export interface BaseDriver {
  connectDatabase(path: string): Promise<Kysely<any>>
  convertFieldToSqlType(field: Field): ColumnDataType
}
