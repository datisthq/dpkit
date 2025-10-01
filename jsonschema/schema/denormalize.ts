import type { Field, Schema } from "@dpkit/core"
import type { JSONSchema7 } from "json-schema"

export function denormalizeJsonSchema(schema: Schema): JSONSchema7 {
  const properties: Record<string, JSONSchema7> = {}
  const required: string[] = []

  for (const field of schema.fields) {
    const property = convertFieldToJsonSchemaProperty(field)
    if (property) {
      properties[field.name] = property

      // Check if field is required
      if (field.constraints?.required) {
        required.push(field.name)
      }
    }
  }

  const jsonSchema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema",
    type: "object",
    properties,
  }

  if (required.length > 0) {
    jsonSchema.required = required
  }

  if (schema.title) {
    jsonSchema.title = schema.title
  }

  if (schema.description) {
    jsonSchema.description = schema.description
  }

  return jsonSchema
}

function convertFieldToJsonSchemaProperty(field: Field): JSONSchema7 | null {
  const baseProperty: Partial<JSONSchema7> = {}

  if (field.title) {
    baseProperty.title = field.title
  }

  if (field.description) {
    baseProperty.description = field.description
  }

  // Handle different Table Schema field types
  switch (field.type) {
    case "string": {
      const property: JSONSchema7 = {
        ...baseProperty,
        type: "string",
      }

      if (field.constraints?.minLength !== undefined) {
        property.minLength = field.constraints.minLength
      }
      if (field.constraints?.maxLength !== undefined) {
        property.maxLength = field.constraints.maxLength
      }
      if (field.constraints?.pattern) {
        property.pattern = field.constraints.pattern
      }
      if (field.constraints?.enum) {
        property.enum = field.constraints.enum
      }

      return property
    }

    case "number": {
      const property: JSONSchema7 = {
        ...baseProperty,
        type: "number",
      }

      if (
        field.constraints?.minimum !== undefined &&
        typeof field.constraints.minimum === "number"
      ) {
        property.minimum = field.constraints.minimum
      }
      if (
        field.constraints?.maximum !== undefined &&
        typeof field.constraints.maximum === "number"
      ) {
        property.maximum = field.constraints.maximum
      }

      return property
    }

    case "integer": {
      const property: JSONSchema7 = {
        ...baseProperty,
        type: "integer",
      }

      if (
        field.constraints?.minimum !== undefined &&
        typeof field.constraints.minimum === "number"
      ) {
        property.minimum = field.constraints.minimum
      }
      if (
        field.constraints?.maximum !== undefined &&
        typeof field.constraints.maximum === "number"
      ) {
        property.maximum = field.constraints.maximum
      }

      return property
    }

    case "boolean": {
      return {
        ...baseProperty,
        type: "boolean",
      }
    }

    case "array": {
      const property: JSONSchema7 = {
        ...baseProperty,
        type: "array",
      }

      if (field.constraints?.minLength !== undefined) {
        property.minItems = field.constraints.minLength
      }
      if (field.constraints?.maxLength !== undefined) {
        property.maxItems = field.constraints.maxLength
      }
      if (field.constraints?.jsonSchema) {
        property.items = field.constraints.jsonSchema
      }

      return property
    }

    case "object": {
      const property: JSONSchema7 = {
        ...baseProperty,
        type: "object",
      }

      // If there's a jsonSchema constraint, merge it
      if (field.constraints?.jsonSchema) {
        return {
          ...property,
          ...field.constraints.jsonSchema,
        }
      }

      return property
    }

    // For other field types that don't have direct JSONSchema equivalents,
    // convert them to string type with format information
    case "date":
      return {
        ...baseProperty,
        type: "string",
        format: "date",
      }

    case "datetime":
      return {
        ...baseProperty,
        type: "string",
        format: "date-time",
      }

    case "time":
      return {
        ...baseProperty,
        type: "string",
        format: "time",
      }

    case "year":
    case "yearmonth":
    case "duration":
      return {
        ...baseProperty,
        type: "string",
        format: field.type,
      }

    case "geopoint":
      return {
        ...baseProperty,
        type: "string",
        format: "geopoint",
      }

    case "geojson":
      return {
        ...baseProperty,
        type: "object",
        format: "geojson",
      }

    case "list":
      return {
        ...baseProperty,
        type: "array",
        format: "list",
      }

    default:
      // Default to string type for unknown field types
      return {
        ...baseProperty,
        type: "string",
      }
  }
}
