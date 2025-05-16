import { describe, expect, it } from "vitest"
import { validateDescriptor } from "./validate.js"

describe("validateDescriptor", () => {
  it("returns empty array for valid descriptor", async () => {
    const descriptor = {
      name: "test-package",
      version: "1.0.0",
      description: "A test package",
    }

    const defaultProfile = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const result = await validateDescriptor({
      descriptor,
      defaultProfile,
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("returns validation errors for invalid descriptor", async () => {
    const defaultProfile = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const descriptor = {
      name: "test-package",
      version: 123,
      description: "A test package with wrong version type",
    }

    const result = await validateDescriptor({
      descriptor,
      defaultProfile,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
      expect(error.instancePath).toBe("/version")
    }
  })

  it("returns errors when required fields are missing", async () => {
    const defaultProfile = {
      type: "object",
      required: ["name", "version", "required_field"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        required_field: { type: "string" },
      },
    }

    const descriptor = {
      name: "test-package",
      version: "1.0.0",
    }

    const result = await validateDescriptor({
      descriptor,
      defaultProfile,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("required")
      expect(error.params).toBeDefined()
      if (error.params) {
        expect(error.params.missingProperty).toBe("required_field")
      }
    }
  })

  it("validates nested objects in the descriptor", async () => {
    const defaultProfile = {
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

    const descriptor = {
      name: "test-package",
      version: "1.0.0",
      author: {
        name: "Test Author",
        email: "invalid-email",
      },
    }

    const result = await validateDescriptor({
      descriptor,
      defaultProfile,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const hasEmailPatternError = result.errors.some(
      error =>
        error &&
        error.instancePath === "/author/email" &&
        error.keyword === "pattern",
    )

    expect(hasEmailPatternError).toBe(true)
  })
})
