import { describe, expect, it } from "vitest"
import { inspectJsonValue } from "./value.ts"

describe("inspectJsonValue", () => {
  it("returns empty array for valid value", async () => {
    const value = {
      name: "test-package",
      version: "1.0.0",
      description: "A test package",
    }

    const jsonSchema = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const errors = await inspectJsonValue(value, { jsonSchema })

    expect(errors).toEqual([])
  })

  it("returns validation errors for invalid value", async () => {
    const jsonSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
      },
    }

    const value = {
      name: "test-package",
      version: 123,
    }

    const errors = await inspectJsonValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].pointer).toBe("/version")
    expect(errors[0].message).toContain("string")
  })

  it("returns errors when required fields are missing", async () => {
    const jsonSchema = {
      type: "object",
      required: ["name", "version", "required_field"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        required_field: { type: "string" },
      },
    }

    const value = {
      name: "test-package",
      version: "1.0.0",
    }

    const errors = await inspectJsonValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]?.pointer).toBe("")
    expect(errors[0]?.message).toContain("required_field")
  })

  it("validates nested objects in the value", async () => {
    const jsonSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        author: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: {
              type: "string",
              pattern: "^[^@]+@[^@]+\\.[^@]+$",
            },
          },
        },
      },
    }

    const value = {
      name: "test-package",
      version: "1.0.0",
      author: {
        name: "Test Author",
        email: "invalid-email",
      },
    }

    const errors = await inspectJsonValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)
    expect(
      errors.some(
        error =>
          error.pointer === "/author/email" &&
          error.message.includes("pattern"),
      ),
    ).toBe(true)
  })

  it("returns multiple errors for value with multiple issues", async () => {
    const jsonSchema = {
      type: "object",
      required: ["license"],
      additionalProperties: false,
      properties: {
        name: { type: "string", minLength: 3 },
        version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
        license: { type: "string" },
        description: { type: "string" },
        keywords: {
          type: "array",
          items: { type: "string" },
        },
      },
    }

    const value = {
      name: "ab",
      version: "not-a-version",
      description: 123,
      keywords: ["valid", 456, "another"],
      extra_field: "should not be here",
    }

    const errors = await inspectJsonValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(3)

    const errorPointers = errors.map(err => err.pointer)
    expect(errorPointers).toContain("")
    expect(errorPointers).toContain("/name")
    expect(errorPointers).toContain("/version")
    expect(errorPointers).toContain("/description")
  })
})
