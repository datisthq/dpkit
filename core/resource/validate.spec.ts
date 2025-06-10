import { describe, expect, it } from "vitest"
import { validateResourceDescriptor } from "./validate.js"

describe("validateResourceDescriptor", () => {
  it("returns valid result for valid resource", async () => {
    const descriptor = {
      name: "example-resource",
      path: "data.csv",
      format: "csv",
      encoding: "utf-8",
    }

    const result = await validateResourceDescriptor(descriptor)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("returns validation errors for invalid resource", async () => {
    const invalidResource = {
      name: 123, // Should be a string
      path: true, // Should be a string or array of strings
    }

    const result = await validateResourceDescriptor(invalidResource)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
    }
  })
})
