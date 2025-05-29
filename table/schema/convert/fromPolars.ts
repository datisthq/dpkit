import type { Schema, Field } from "@dpkit/core"
import type { PolarsSchema } from "../Schema.js"
import type { DataType } from "nodejs-polars"

/**
 * Converts a Polars schema to a Data Package Table Schema
 */
export function convertSchemaFromPolars(props: { schema: PolarsSchema }): Schema {
  const { schema } = props
  
  if (!schema || typeof schema !== "object" || Object.keys(schema).length === 0) {
    throw new Error("Invalid Polars schema: schema must be a non-empty object")
  }
  
  const fields: Field[] = []

  // Convert each field in the Polars schema to a Table Schema field
  for (const [name, dtype] of Object.entries(schema)) {
    if (!name) {
      throw new Error("Invalid field name: field name cannot be empty")
    }
    
    if (!dtype) {
      throw new Error(`Invalid data type for field '${name}': data type cannot be empty`)
    }
    
    const field = convertPolarsFieldToTableField(name, dtype)
    fields.push(field)
  }

  return { fields }
}

/**
 * Converts a Polars field to a Table Schema field
 */
function convertPolarsFieldToTableField(name: string, dtype: string | DataType): Field {
  if (!name) {
    throw new Error("Field name is required")
  }
  
  // If dtype is a string, we use it directly, otherwise extract the variant
  const dataType = typeof dtype === "string" ? dtype : (dtype?.variant || "")
  
  if (!dataType) {
    throw new Error(`Unable to determine data type for field '${name}'`)
  }

  switch (dataType) {
    // Integer types
    case "Int8":
    case "Int16":
    case "Int32":
    case "Int64":
    case "UInt8":
    case "UInt16":
    case "UInt32":
    case "UInt64":
      return {
        name,
        type: "integer"
      }

    // Float types
    case "Float32":
    case "Float64":
      return {
        name,
        type: "number"
      }

    // Boolean type
    case "Bool":
      return {
        name,
        type: "boolean"
      }

    // String type
    case "Utf8":
      return {
        name,
        type: "string"
      }

    // Date type
    case "Date":
      return {
        name,
        type: "date"
      }

    // Time type
    case "Time":
      return {
        name,
        type: "time"
      }

    // Datetime type (with or without timezone)
    case "Datetime":
      return {
        name,
        type: "datetime"
      }

    // List type
    case "List":
      return {
        name,
        type: "array"
      }

    // Struct type
    case "Struct":
      return {
        name,
        type: "object"
      }

    // Default to any type for unsupported types
    default:
      return {
        name,
        type: "any"
      }
  }
}
