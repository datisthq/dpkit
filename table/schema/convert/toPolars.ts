import type { Field, Schema } from "@dpkit/core"
import {
  Bool,
  Date,
  Datetime,
  Float64,
  Int64,
  List,
  Object,
  Struct,
  Time,
  Utf8,
} from "nodejs-polars"
import type { PolarsSchema } from "../Schema.js"

/**
 * Converts a Data Package Table Schema to a Polars schema
 */
export function convertSchemaToPolars(props: { schema: Schema }): PolarsSchema {
  const { schema } = props

  if (!schema) {
    throw new Error("Invalid schema: schema cannot be null or undefined")
  }

  if (!schema.fields || !Array.isArray(schema.fields)) {
    throw new Error("Invalid schema: schema must have a fields array")
  }

  if (schema.fields.length === 0) {
    throw new Error("Invalid schema: schema must have at least one field")
  }

  const polarsSchema: PolarsSchema = {}

  // Convert each field in the Table Schema to a Polars data type
  for (const field of schema.fields) {
    if (!field.name) {
      throw new Error("Invalid field: name is required")
    }

    if (!field.type) {
      throw new Error(`Invalid field '${field.name}': type is required`)
    }

    const polarsDtype = convertTableFieldToPolarsType(field)
    // TODO: fix
    // @ts-ignore
    polarsSchema[field.name] = polarsDtype
  }

  return polarsSchema
}

/**
 * Converts a Table Schema field to a Polars data type string
 */
function convertTableFieldToPolarsType(field: Field) {
  switch (field.type) {
    case "string":
      return Utf8

    case "number":
      return Float64

    case "integer":
      return Int64

    case "boolean":
      return Bool

    case "date":
      return Date

    case "time":
      return Time

    case "datetime":
      return Datetime

    case "array":
    case "list":
    case "geopoint":
      return List

    case "object":
      return Struct

    default:
      return Object
  }
}
