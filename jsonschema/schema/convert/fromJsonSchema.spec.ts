import type { JSONSchema7 } from "json-schema"
import { describe, expect, it } from "vitest"
import { convertSchemaFromJsonSchema } from "./fromJsonSchema.ts"

describe("convertSchemaFromJsonSchema", () => {
  it("converts JSONSchema object to Table Schema", () => {
    const jsonSchema: JSONSchema7 = {
      type: "object",
      title: "User Schema",
      description: "Schema for user data",
      required: ["id", "name"],
      properties: {
        id: {
          type: "integer",
          title: "User ID",
          description: "Unique identifier",
          minimum: 1,
        },
        name: {
          type: "string",
          title: "Full Name",
          maxLength: 100,
        },
        email: {
          type: "string",
          pattern: "^[^@]+@[^@]+\\.[^@]+$",
        },
        age: {
          type: "integer",
          minimum: 0,
          maximum: 150,
        },
        isActive: {
          type: "boolean",
        },
        tags: {
          type: "array",
          minItems: 0,
          maxItems: 10,
        },
        metadata: {
          type: "object",
        },
      },
    }

    const tableSchema = convertSchemaFromJsonSchema(jsonSchema)

    expect(tableSchema.title).toBe("User Schema")
    expect(tableSchema.description).toBe("Schema for user data")
    expect(tableSchema.fields).toHaveLength(7)

    const idField = tableSchema.fields.find(f => f.name === "id")
    expect(idField).toEqual({
      name: "id",
      type: "integer",
      title: "User ID",
      description: "Unique identifier",
      constraints: {
        required: true,
        minimum: 1,
      },
    })

    const nameField = tableSchema.fields.find(f => f.name === "name")
    expect(nameField).toEqual({
      name: "name",
      type: "string",
      title: "Full Name",
      constraints: {
        required: true,
        maxLength: 100,
      },
    })

    const emailField = tableSchema.fields.find(f => f.name === "email")
    expect(emailField).toEqual({
      name: "email",
      type: "string",
      constraints: {
        pattern: "^[^@]+@[^@]+\\.[^@]+$",
      },
    })

    const ageField = tableSchema.fields.find(f => f.name === "age")
    expect(ageField).toEqual({
      name: "age",
      type: "integer",
      constraints: {
        minimum: 0,
        maximum: 150,
      },
    })

    const isActiveField = tableSchema.fields.find(f => f.name === "isActive")
    expect(isActiveField).toEqual({
      name: "isActive",
      type: "boolean",
    })

    const tagsField = tableSchema.fields.find(f => f.name === "tags")
    expect(tagsField).toEqual({
      name: "tags",
      type: "array",
      constraints: {
        minLength: 0,
        maxLength: 10,
      },
    })

    const metadataField = tableSchema.fields.find(f => f.name === "metadata")
    expect(metadataField).toEqual({
      name: "metadata",
      type: "object",
      constraints: {
        jsonSchema: {
          type: "object",
        },
      },
    })
  })

  it("handles union types by picking first non-null type", () => {
    const jsonSchema: JSONSchema7 = {
      type: "object",
      properties: {
        nullableString: {
          type: ["string", "null"],
        },
        multiType: {
          type: ["number", "string"],
        },
      },
    }

    const tableSchema = convertSchemaFromJsonSchema(jsonSchema)

    const nullableField = tableSchema.fields.find(
      f => f.name === "nullableString",
    )
    expect(nullableField?.type).toBe("string")

    const multiField = tableSchema.fields.find(f => f.name === "multiType")
    expect(multiField?.type).toBe("number")
  })

  it("defaults to string type for unknown types", () => {
    const jsonSchema: JSONSchema7 = {
      type: "object",
      properties: {
        unknownField: {},
      },
    }

    const tableSchema = convertSchemaFromJsonSchema(jsonSchema)

    const unknownField = tableSchema.fields.find(f => f.name === "unknownField")
    expect(unknownField?.type).toBe("string")
  })

  it("skips boolean schema properties", () => {
    const jsonSchema: JSONSchema7 = {
      type: "object",
      properties: {
        validField: {
          type: "string",
        },
        booleanSchema: true,
        falseBooleanSchema: false,
      },
    }

    const tableSchema = convertSchemaFromJsonSchema(jsonSchema)

    expect(tableSchema.fields).toHaveLength(1)
    expect(tableSchema.fields[0]?.name).toBe("validField")
  })
})
