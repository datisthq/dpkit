import type { Schema } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import { convertSchemaToJsonSchema } from "./toJsonSchema.ts"

describe("convertSchemaToJsonSchema", () => {
  it("converts Table Schema to JSONSchema object", () => {
    const tableSchema: Schema & { title?: string; description?: string } = {
      title: "User Schema",
      description: "Schema for user data",
      fields: [
        {
          name: "id",
          type: "integer",
          title: "User ID",
          description: "Unique identifier",
          constraints: {
            required: true,
            minimum: 1,
          },
        },
        {
          name: "name",
          type: "string",
          title: "Full Name",
          constraints: {
            required: true,
            maxLength: 100,
          },
        },
        {
          name: "email",
          type: "string",
          constraints: {
            pattern: "^[^@]+@[^@]+\\.[^@]+$",
          },
        },
        {
          name: "age",
          type: "integer",
          constraints: {
            minimum: 0,
            maximum: 150,
          },
        },
        {
          name: "isActive",
          type: "boolean",
        },
        {
          name: "tags",
          type: "array",
          constraints: {
            minLength: 0,
            maxLength: 10,
          },
        },
        {
          name: "metadata",
          type: "object",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                category: { type: "string" },
              },
            },
          },
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect(jsonSchema.title).toBe("User Schema")
    expect(jsonSchema.description).toBe("Schema for user data")
    expect(jsonSchema.type).toBe("object")
    expect(jsonSchema.required).toEqual(["id", "name"])
    expect(Object.keys(jsonSchema.properties || {})).toHaveLength(7)

    expect((jsonSchema.properties as any)?.id).toEqual({
      type: "integer",
      title: "User ID",
      description: "Unique identifier",
      minimum: 1,
    })

    expect((jsonSchema.properties as any)?.name).toEqual({
      type: "string",
      title: "Full Name",
      maxLength: 100,
    })

    expect((jsonSchema.properties as any)?.email).toEqual({
      type: "string",
      pattern: "^[^@]+@[^@]+\\.[^@]+$",
    })

    expect((jsonSchema.properties as any)?.age).toEqual({
      type: "integer",
      minimum: 0,
      maximum: 150,
    })

    expect((jsonSchema.properties as any)?.isActive).toEqual({
      type: "boolean",
    })

    expect((jsonSchema.properties as any)?.tags).toEqual({
      type: "array",
      minItems: 0,
      maxItems: 10,
    })

    expect((jsonSchema.properties as any)?.metadata).toEqual({
      type: "object",
      properties: {
        category: { type: "string" },
      },
    })
  })

  it("handles string field types with various constraints", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "basicString",
          type: "string",
        },
        {
          name: "constrainedString",
          type: "string",
          constraints: {
            minLength: 5,
            maxLength: 50,
            pattern: "^[A-Z]",
            enum: ["Option1", "Option2", "Option3"],
          },
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.basicString).toEqual({
      type: "string",
    })

    expect((jsonSchema.properties as any)?.constrainedString).toEqual({
      type: "string",
      minLength: 5,
      maxLength: 50,
      pattern: "^[A-Z]",
      enum: ["Option1", "Option2", "Option3"],
    })
  })

  it("handles numeric field types", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "simpleNumber",
          type: "number",
        },
        {
          name: "constrainedNumber",
          type: "number",
          constraints: {
            minimum: 0.1,
            maximum: 99.9,
          },
        },
        {
          name: "simpleInteger",
          type: "integer",
        },
        {
          name: "constrainedInteger",
          type: "integer",
          constraints: {
            minimum: 1,
            maximum: 100,
          },
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.simpleNumber).toEqual({
      type: "number",
    })

    expect((jsonSchema.properties as any)?.constrainedNumber).toEqual({
      type: "number",
      minimum: 0.1,
      maximum: 99.9,
    })

    expect((jsonSchema.properties as any)?.simpleInteger).toEqual({
      type: "integer",
    })

    expect((jsonSchema.properties as any)?.constrainedInteger).toEqual({
      type: "integer",
      minimum: 1,
      maximum: 100,
    })
  })

  it("handles array and object field types", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "simpleArray",
          type: "array",
        },
        {
          name: "constrainedArray",
          type: "array",
          constraints: {
            minLength: 1,
            maxLength: 5,
            jsonSchema: {
              type: "string",
            },
          },
        },
        {
          name: "simpleObject",
          type: "object",
        },
        {
          name: "constrainedObject",
          type: "object",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                nested: { type: "string" },
              },
              required: ["nested"],
            },
          },
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.simpleArray).toEqual({
      type: "array",
    })

    expect((jsonSchema.properties as any)?.constrainedArray).toEqual({
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: {
        type: "string",
      },
    })

    expect((jsonSchema.properties as any)?.simpleObject).toEqual({
      type: "object",
    })

    expect((jsonSchema.properties as any)?.constrainedObject).toEqual({
      type: "object",
      properties: {
        nested: { type: "string" },
      },
      required: ["nested"],
    })
  })

  it("handles date and time field types", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "dateField",
          type: "date",
          title: "Date Field",
        },
        {
          name: "datetimeField",
          type: "datetime",
          description: "DateTime Field",
        },
        {
          name: "timeField",
          type: "time",
        },
        {
          name: "yearField",
          type: "year",
        },
        {
          name: "yearmonthField",
          type: "yearmonth",
        },
        {
          name: "durationField",
          type: "duration",
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.dateField).toEqual({
      type: "string",
      format: "date",
      title: "Date Field",
    })

    expect((jsonSchema.properties as any)?.datetimeField).toEqual({
      type: "string",
      format: "date-time",
      description: "DateTime Field",
    })

    expect((jsonSchema.properties as any)?.timeField).toEqual({
      type: "string",
      format: "time",
    })

    expect((jsonSchema.properties as any)?.yearField).toEqual({
      type: "string",
      format: "year",
    })

    expect((jsonSchema.properties as any)?.yearmonthField).toEqual({
      type: "string",
      format: "yearmonth",
    })

    expect((jsonSchema.properties as any)?.durationField).toEqual({
      type: "string",
      format: "duration",
    })
  })

  it("handles geospatial field types", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "geopointField",
          type: "geopoint",
        },
        {
          name: "geojsonField",
          type: "geojson",
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.geopointField).toEqual({
      type: "string",
      format: "geopoint",
    })

    expect((jsonSchema.properties as any)?.geojsonField).toEqual({
      type: "object",
      format: "geojson",
    })
  })

  it("handles special field types", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "listField",
          type: "list",
        },
        {
          name: "anyField",
          type: "any",
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect((jsonSchema.properties as any)?.listField).toEqual({
      type: "array",
      format: "list",
    })

    expect((jsonSchema.properties as any)?.anyField).toEqual({
      type: "string",
    })
  })

  it("handles schema without title and description", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect(jsonSchema.title).toBeUndefined()
    expect(jsonSchema.description).toBeUndefined()
    expect(jsonSchema.type).toBe("object")
    expect((jsonSchema.properties as any)?.field1).toEqual({
      type: "string",
    })
  })

  it("handles schema with no required fields", () => {
    const tableSchema: Schema = {
      fields: [
        {
          name: "optionalField1",
          type: "string",
        },
        {
          name: "optionalField2",
          type: "integer",
        },
      ],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect(jsonSchema.required).toBeUndefined()
    expect((jsonSchema.properties as any)?.optionalField1).toEqual({
      type: "string",
    })
    expect((jsonSchema.properties as any)?.optionalField2).toEqual({
      type: "integer",
    })
  })

  it("handles empty schema", () => {
    const tableSchema: Schema = {
      fields: [],
    }

    const jsonSchema = convertSchemaToJsonSchema(tableSchema)

    expect(jsonSchema.type).toBe("object")
    expect(jsonSchema.properties).toEqual({})
    expect(jsonSchema.required).toBeUndefined()
    expect(jsonSchema.title).toBeUndefined()
    expect(jsonSchema.description).toBeUndefined()
  })
})
