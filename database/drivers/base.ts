import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import type { ColumnDataType, Kysely } from "kysely"

export interface BaseDriver {
  connectDatabase(path: string): Promise<Kysely<any>>
  convertFieldToSql(field: Field): ColumnDataType
  convertRecordToSql(record: DataRecord, schema: Schema): void
}
