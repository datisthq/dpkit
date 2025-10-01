import type { JSONSchema7, JSONSchema7Object } from "json-schema"
import type { Schema, Field } from "@dpkit/core"

export function normalizeJsonSchema(jsonSchema: JSONSchema7Object): Schema {
  const fields: Field[] = []
  const requiredFields = new Set(
    Array.isArray(jsonSchema.required) ? jsonSchema.required : []
  )

  for (const [name, property] of Object.entries(jsonSchema.properties || {})) {
    if (typeof property === "boolean") {
      continue // Skip boolean schemas
    }

    const field = convertJsonSchemaPropertyToField(name, property, requiredFields.has(name))
    if (field) {
      fields.push(field)
    }
  }

  const schema: Schema & { title?: string; description?: string } = {
    fields,
  }

  if (typeof jsonSchema.title === "string") {
    schema.title = jsonSchema.title
  }

  if (typeof jsonSchema.description === "string") {
    schema.description = jsonSchema.description
  }

  return schema
}

function convertJsonSchemaPropertyToField(
  name: string,
  property: JSONSchema7,
  isRequired: boolean
): Field | null {
  if (typeof property === "boolean") {
    return null
  }

  const baseField = {
    name,
    title: property.title,
    description: property.description,
    constraints: isRequired ? { required: true } : undefined,
  }

  // Handle different JSONSchema types
  switch (property.type) {
    case "string":
      return {
        ...baseField,
        type: "string",
        constraints: {
          ...baseField.constraints,
          minLength: property.minLength,
          maxLength: property.maxLength,
          pattern: property.pattern,
          enum: property.enum as string[] | undefined,
        },
      } as Field

    case "number":
      return {
        ...baseField,
        type: "number",
        constraints: {
          ...baseField.constraints,
          minimum: property.minimum,
          maximum: property.maximum,
        },
      } as Field

    case "integer":
      return {
        ...baseField,
        type: "integer",
        constraints: {
          ...baseField.constraints,
          minimum: property.minimum,
          maximum: property.maximum,
        },
      } as Field

    case "boolean":
      return {
        ...baseField,
        type: "boolean",
      } as Field

    case "array":
      return {
        ...baseField,
        type: "array",
        constraints: {
          ...baseField.constraints,
          minLength: property.minItems,
          maxLength: property.maxItems,
          jsonSchema: property.items as Record<string, any>,
        },
      } as Field

    case "object":
      return {
        ...baseField,
        type: "object",
        constraints: {
          ...baseField.constraints,
          jsonSchema: property as Record<string, any>,
        },
      } as Field

    default:
      // Handle union types or unspecified types
      if (Array.isArray(property.type)) {
        // For union types, pick the first non-null type or default to string
        const nonNullType = property.type.find(t => t !== "null")
        if (nonNullType) {
          return convertJsonSchemaPropertyToField(name, { ...property, type: nonNullType }, isRequired)
        }
      }

      // Default to string type for unknown/unspecified types
      return {
        ...baseField,
        type: "string",
      } as Field
  }
}
