import { describe, expect, it } from "vitest"
import { inspectValue } from "./inspect.ts"

describe("inspectValue", () => {
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

    const errors = await inspectValue(value, { jsonSchema })

    expect(errors).toEqual([])
  })

  it("returns validation errors for invalid value", async () => {
    const jsonSchema = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const value = {
      name: "test-package",
      version: 123,
      description: "A test package with wrong version type",
    }

    const errors = await inspectValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)

    const error = errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.pointer).toBe("/version")
      expect(error.message).toContain("string")
    }
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

    const errors = await inspectValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)

    const error = errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.pointer).toBe("")
      expect(error.message).toContain("required_field")
    }
  })

  it("validates nested objects in the value", async () => {
    const jsonSchema = {
      type: "object",
      required: ["name", "version", "author"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        author: {
          type: "object",
          required: ["name", "email"],
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

    const errors = await inspectValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(0)

    const hasEmailPatternError = errors.some(
      error =>
        error &&
        error.pointer === "/author/email" &&
        error.message.includes("pattern"),
    )

    expect(hasEmailPatternError).toBe(true)
  })

  it("returns multiple errors for value with multiple issues", async () => {
    const jsonSchema = {
      type: "object",
      required: ["name", "version", "license"],
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

    const errors = await inspectValue(value, { jsonSchema })

    expect(errors.length).toBeGreaterThan(3)

    const errorPointers = errors.map(err => err?.pointer)
    expect(errorPointers).toContain("")
    expect(errorPointers).toContain("/name")
    expect(errorPointers).toContain("/version")
    expect(errorPointers).toContain("/description")
  })
})
