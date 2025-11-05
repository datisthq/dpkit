import type { Field, FieldType, Schema } from "@dpkit/metadata"
import type { Dialect } from "kysely"
import { Kysely } from "kysely"
import { LRUCache } from "lru-cache"
import type { DatabaseField, DatabaseType } from "../field/index.ts"
import type { DatabaseSchema } from "../schema/index.ts"

// We cache database connections (only works in serverfull environments)
const databases = new LRUCache<string, Kysely<any>>({
  dispose: database => database.destroy(),
  max: 10,
})

export abstract class BaseAdapter {
  abstract get nativeTypes(): FieldType[]

  async connectDatabase(path: string, options?: { create?: boolean }) {
    const cachedDatabase = databases.get(path)
    if (cachedDatabase) {
      return cachedDatabase
    }

    const dialect = await this.createDialect(path, options)
    const database = new Kysely<any>({ dialect })
    databases.set(path, new Kysely<any>({ dialect }))

    return database
  }

  abstract createDialect(
    path: string,
    options?: { create?: boolean },
  ): Promise<Dialect>

  normalizeSchema(databaseSchema: DatabaseSchema) {
    const schema: Schema = { fields: [] }

    for (const databaseField of databaseSchema.columns) {
      schema.fields.push(this.normalizeField(databaseField))
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

  abstract normalizeType(databaseType: DatabaseType): Field["type"]

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

  abstract denormalizeType(fieldType: Field["type"]): DatabaseType
}
