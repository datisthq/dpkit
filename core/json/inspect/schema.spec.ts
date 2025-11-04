import { describe, expect, it } from "vitest"
import { inspectJsonSchema } from "./schema.ts"

describe("inspectJsonSchema", () => {
  it("returns empty array for valid JSON Schema", async () => {
    const descriptor = {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })

  it("returns empty array for valid JSON Schema with required fields", async () => {
    const descriptor = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })

  it("returns empty array for nested JSON Schema", async () => {
    const descriptor = {
      type: "object",
      properties: {
        author: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })

  it("returns empty array for JSON Schema with array items", async () => {
    const descriptor = {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
        },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })

  it("returns validation errors for invalid JSON Schema structure", async () => {
    const descriptor = {
      type: "invalid-type",
      properties: {
        name: { type: "string" },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors.length).toBeGreaterThan(0)
  })

  it("returns validation errors for malformed properties", async () => {
    const descriptor = {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: "not-a-number",
        },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors.length).toBeGreaterThan(0)
  })

  it("returns validation errors for invalid required field", async () => {
    const descriptor = {
      type: "object",
      required: "should-be-an-array",
      properties: {
        name: { type: "string" },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors.length).toBeGreaterThan(0)
  })

  it("returns multiple errors for JSON Schema with multiple issues", async () => {
    const descriptor = {
      type: "invalid-type",
      required: "should-be-array",
      properties: {
        field1: {
          type: "string",
          minLength: "not-a-number",
        },
        field2: {
          type: "unknown-type",
        },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors.length).toBeGreaterThan(1)
  })

  it("returns empty array for empty JSON Schema", async () => {
    const descriptor = {}

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })

  it("returns empty array for JSON Schema with definitions", async () => {
    const descriptor = {
      type: "object",
      properties: {
        user: { $ref: "#/definitions/User" },
      },
      definitions: {
        User: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
      },
    }

    const errors = await inspectJsonSchema(descriptor)

    expect(errors).toEqual([])
  })
})
