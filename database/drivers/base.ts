import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import type { ColumnDataType, ColumnMetadata, Kysely } from "kysely"

// TODO: Make a class and implement common methods like:
//- normalizeSchema(databaseSchema) -> schema
//- denormalizeSchema(schema) -> databaseSchema

// TODO: Remove convert methods

export abstract class BaseDriver {
  abstract connectDatabase(path: string): Promise<Kysely<any>>
  abstract convertFieldToSql(field: Field): ColumnDataType
  abstract convertRecordToSql(record: DataRecord, schema: Schema): void
  abstract convertColumnToField(column: ColumnMetadata): Field
}
