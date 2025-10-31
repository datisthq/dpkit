import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadDescriptor } from "../descriptor/index.ts"
import { validatePackageMetadata } from "./validate.ts"

useRecording()

describe("validatePackageMetadata", () => {
  it("returns valid result for valid package", async () => {
    const descriptor = {
      name: "example-package",
      resources: [
        {
          name: "resource-1",
          path: "data.csv",
        },
      ],
    }

    const { valid, errors } = await validatePackageMetadata(descriptor)

    expect(valid).toBe(true)
    expect(errors).toEqual([])
  })

  it("returns validation errors for invalid package", async () => {
    const descriptor = {
      name: 123, // Should be a string
      resources: "not-an-array", // Should be an array
    }

    const { valid, errors } = await validatePackageMetadata(descriptor)

    expect(valid).toBe(false)
    expect(errors.length).toBeGreaterThan(0)

    const error = errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
    }
  })

  it("should validate camtrap dp (#144)", async () => {
    const descriptor = await loadDescriptor(
      "https://raw.githubusercontent.com/tdwg/camtrap-dp/refs/tags/1.0.2/example/datapackage.json",
    )

    const { valid } = await validatePackageMetadata(descriptor)
    expect(valid).toBe(true)
  })
})
