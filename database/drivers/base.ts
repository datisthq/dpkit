import type { Field, FieldType, Schema } from "@dpkit/core"
import type { Kysely } from "kysely"
import type { DatabaseField } from "../field/index.ts"
import type { DatabaseSchema } from "../schema/index.ts"

export abstract class BaseDriver {
  abstract get nativeTypes(): FieldType[]
  abstract connectDatabase(path: string): Promise<Kysely<any>>
  abstract normalizeType(databaseType: DatabaseField["dataType"]): Field["type"]
  abstract denormalizeType(fieldType: Field["type"]): DatabaseField["dataType"]

  normalizeSchema(databaseSchema: DatabaseSchema) {
    const schema: Schema = { fields: [] }

    for (const column of databaseSchema.columns) {
      schema.fields.push(this.normalizeField(column))
    }

    return schema
  }

  normalizeField(databaseField: DatabaseField) {
    const field: Field = {
      name: databaseField.name,
      type: this.normalizeType(databaseField.dataType),
    }

    if (!databaseField.isNullable) {
      field.constraints ??= {}
      field.constraints.required = true
    }

    if (databaseField.comment) {
      field.description = databaseField.comment
    }

    return field
  }

  denormalizeSchema(schema: Schema, tableName: string): DatabaseSchema {
    const databaseSchema: DatabaseSchema = {
      name: tableName,
      columns: [],
      isView: false,
    }

    for (const field of schema.fields) {
      databaseSchema.columns.push(this.denormalizeField(field))
    }

    if (schema.primaryKey) {
      databaseSchema.primaryKey = schema.primaryKey
    }

    return databaseSchema
  }

  denormalizeField(field: Field): DatabaseField {
    const databaseField: DatabaseField = {
      name: field.name,
      dataType: this.denormalizeType(field.type),
      isNullable: !field.constraints?.required,
      comment: field.description,
      isAutoIncrementing: false,
      hasDefaultValue: false,
    }

    return databaseField
  }
}
