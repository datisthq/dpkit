import { describe, expect, it } from "vitest"
import type { Package } from "./Package.js"
import { validatePackageDescriptor } from "./validate.js"

describe("validatePackageDescriptor", () => {
  it("returns valid result for valid package", async () => {
    const validPackage: Package = {
      name: "example-package",
      resources: [
        {
          name: "resource-1",
          path: "data.csv",
        },
      ],
    }

    const result = await validatePackageDescriptor({
      descriptor: validPackage,
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("returns validation errors for invalid package", async () => {
    const invalidPackage = {
      name: 123, // Should be a string
      resources: "not-an-array", // Should be an array
    }

    const result = await validatePackageDescriptor({
      descriptor: invalidPackage,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
    }
  })
})
