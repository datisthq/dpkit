import type { Field, Schema } from "@dpkit/core"
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
    polarsSchema[field.name] = polarsDtype
  }

  return polarsSchema
}

/**
 * Converts a Table Schema field to a Polars data type string
 */
function convertTableFieldToPolarsType(field: Field): string {
  if (!field) {
    throw new Error("Invalid field: field cannot be null or undefined")
  }

  if (!field.type) {
    throw new Error(`Invalid field '${field.name}': type is required`)
  }

  switch (field.type) {
    // String type
    case "string":
      return "Utf8"

    // Number type
    case "number":
      return "Float64"

    // Integer type
    case "integer":
      return "Int64"

    // Boolean type
    case "boolean":
      return "Bool"

    // Date type
    case "date":
      return "Date"

    // Time type
    case "time":
      return "Time"

    // Datetime type
    case "datetime":
      return "Datetime"

    // Array or list types
    case "array":
    case "list":
      return "List"

    // Object type
    case "object":
      return "Struct"

    // GeoJSON types
    case "geojson":
      return "Utf8"

    // Geopoint type
    case "geopoint":
      return "List"

    // Duration type
    case "duration":
      return "Utf8"

    // Year and yearmonth types
    case "year":
    case "yearmonth":
      return "Utf8"

    // Default fallback
    case "any":
    default:
      return "Utf8"
  }
}
