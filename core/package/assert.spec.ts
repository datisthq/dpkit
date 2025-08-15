import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../error/index.ts"
import type { Package } from "./Package.ts"
import { assertPackage } from "./assert.ts"

describe("assertPackage", () => {
  it("returns typed package when valid", async () => {
    const descriptor = {
      name: "example-package",
      resources: [
        {
          name: "resource-1",
          path: "data.csv",
        },
      ],
    }

    const datapackage = await assertPackage(descriptor)

    expectTypeOf(datapackage).toEqualTypeOf<Package>()
    expect(datapackage).toEqual(descriptor)
  })

  it("throws AssertionError when package is invalid", async () => {
    const descriptor = {
      name: 123, // Should be a string
      resources: "not-an-array", // Should be an array
    }

    await expect(assertPackage(descriptor)).rejects.toThrow(AssertionError)
  })
})
