import { describe, expect, it } from "vitest"
import { validateMetadata } from "./validate.js"

describe("validateMetadata", () => {
  it("returns empty array for valid metadata", async () => {
    const profile = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const metadata = {
      name: "test-package",
      version: "1.0.0",
      description: "A test package",
    }

    const result = await validateMetadata({
      metadata,
      profile,
    })

    expect(result).toEqual([])
  })

  it("returns validation errors for invalid metadata", async () => {
    const profile = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const metadata = {
      name: "test-package",
      version: 123,
      description: "A test package with wrong version type",
    }

    const result = await validateMetadata({
      metadata,
      profile,
    })

    expect(result).not.toBeNull()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const error = result[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
      expect(error.instancePath).toBe("/version")
    }
  })

  it("returns errors when required fields are missing", async () => {
    const profile = {
      type: "object",
      required: ["name", "version", "required_field"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        required_field: { type: "string" },
      },
    }

    const metadata = {
      name: "test-package",
      version: "1.0.0",
    }

    const result = await validateMetadata({
      metadata,
      profile,
    })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const error = result[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("required")
      expect(error.params).toBeDefined()
      if (error.params) {
        expect(error.params.missingProperty).toBe("required_field")
      }
    }
  })

  it("validates nested objects in the metadata", async () => {
    const profile = {
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

    const metadata = {
      name: "test-package",
      version: "1.0.0",
      author: {
        name: "Test Author",
        email: "invalid-email",
      },
    }

    const result = await validateMetadata({
      metadata,
      profile,
    })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const hasEmailPatternError = result.some(
      error =>
        error &&
        error.instancePath === "/author/email" &&
        error.keyword === "pattern",
    )

    expect(hasEmailPatternError).toBe(true)
  })
})
