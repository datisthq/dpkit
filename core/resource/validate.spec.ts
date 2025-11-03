import { describe, expect, it } from "vitest"
import { validateResourceMetadata } from "./validate.ts"

describe("validateResourceMetadata", () => {
  it("returns valid report for valid resource", async () => {
    const descriptor = {
      name: "example-resource",
      path: "data.csv",
      format: "csv",
      encoding: "utf-8",
    }

    const report = await validateResourceMetadata(descriptor)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid resource", async () => {
    const invalidResource = {
      name: 123, // Should be a string
      path: true, // Should be a string or array of strings
    }

    const report = await validateResourceMetadata(invalidResource)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
    }
  })
})
