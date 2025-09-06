import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import type { ColumnDataType, ColumnMetadata, Kysely } from "kysely"

// TODO: Make a class and implement common methods like:
//- normalizeSchema(databaseSchema) -> schema
//- denormalizeSchema(schema) -> databaseSchema

// TODO: Have createDriver as a static method
// TODO: Remove convert methods

export interface BaseDriver {
  connectDatabase(path: string): Promise<Kysely<any>>
  convertFieldToSql(field: Field): ColumnDataType
  convertRecordToSql(record: DataRecord, schema: Schema): void
  convertColumnToField(column: ColumnMetadata): Field
}
