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

    const report = await validatePackageMetadata(descriptor)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid package", async () => {
    const descriptor = {
      name: 123, // Should be a string
      resources: "not-an-array", // Should be an array
    }

    const report = await validatePackageMetadata(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.pointer).toBe("/name")
    }
  })

  it("should validate camtrap dp (#144)", async () => {
    const descriptor = await loadDescriptor(
      "https://raw.githubusercontent.com/tdwg/camtrap-dp/refs/tags/1.0.2/example/datapackage.json",
    )

    const report = await validatePackageMetadata(descriptor)
    expect(report.valid).toBe(true)
  })
})
