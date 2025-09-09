import type { Field, Schema } from "@dpkit/core"
import type { DataRecord } from "@dpkit/table"
import type { TableMetadata } from "kysely"
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

  normalizeSchema(databaseTable: TableMetadata) {
    const schema: Schema = { fields: [] }

    for (const column of databaseTable.columns) {
      schema.fields.push(this.normalizeField(column))
    }

    return schema
  }

  normalizeField(databaseColumn: ColumnMetadata) {
    const field: Field = {
      name: databaseColumn.name,
      type: this.normalizeType(databaseColumn.dataType),
    }

    if (!databaseColumn.isNullable) {
      field.constraints ??= {}
      field.constraints.required = true
    }

    if (databaseColumn.comment) {
      field.description = databaseColumn.comment
    }

    return field
  }

  abstract normalizeType(
    databaseType: ColumnMetadata["dataType"],
  ): Field["type"]
}
