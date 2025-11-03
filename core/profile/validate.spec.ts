import { describe, expect, it } from "vitest"
import { validateDescriptor } from "./validate.ts"

describe("validateDescriptor", () => {
  it("returns empty array for valid descriptor", async () => {
    const descriptor = {
      name: "test-package",
      version: "1.0.0",
      description: "A test package",
    }

    const profile = {
      type: "object",
      required: ["name", "version"],
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    }

    const report = await validateDescriptor(descriptor, { profile })

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid descriptor", async () => {
    const profile = {
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

    const report = await validateDescriptor(descriptor, { profile })

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
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

    const descriptor = {
      name: "test-package",
      version: "1.0.0",
    }

    const report = await validateDescriptor(descriptor, { profile })

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("required")
      expect(error.params).toBeDefined()
      if (error.params) {
        // @ts-ignore
        expect(error.params.missingProperty).toBe("required_field")
      }
    }
  })

  it("validates nested objects in the descriptor", async () => {
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

    const descriptor = {
      name: "test-package",
      version: "1.0.0",
      author: {
        name: "Test Author",
        email: "invalid-email",
      },
    }

    const report = await validateDescriptor(descriptor, { profile })

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const hasEmailPatternError = report.errors.some(
      error =>
        error &&
        error.instancePath === "/author/email" &&
        error.keyword === "pattern",
    )

    expect(hasEmailPatternError).toBe(true)
  })

  it("returns multiple errors for descriptor with multiple issues", async () => {
    const profile = {
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

    const descriptor = {
      name: "ab",
      version: "not-a-version",
      description: 123,
      keywords: ["valid", 456, "another"],
      extra_field: "should not be here",
    }

    const report = await validateDescriptor(descriptor, { profile })

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(3)

    const errorKeywords = report.errors.map(err => err?.keyword)
    expect(errorKeywords).toContain("required")
    expect(errorKeywords).toContain("minLength")
    expect(errorKeywords).toContain("pattern")
    expect(errorKeywords).toContain("type")
    expect(errorKeywords).toContain("additionalProperties")
  })
})
