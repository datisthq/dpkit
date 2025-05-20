import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../descriptor/index.js"
import type { Package } from "./Package.js"
import { assertPackage } from "./assert.js"

describe("assertPackage", () => {
  it("returns typed package when valid", async () => {
    const validPackage: Package = {
      name: "example-package",
      resources: [
        {
          name: "resource-1",
          path: "data.csv",
        },
      ],
    }

    const result = await assertPackage({
      descriptor: validPackage,
    })

    expectTypeOf(result).toEqualTypeOf<Package>()
    expect(result).toEqual(validPackage)
  })

  it("throws AssertionError when package is invalid", async () => {
    const invalidPackage = {
      name: 123, // Should be a string
      resources: "not-an-array", // Should be an array
    }

    await expect(
      assertPackage({
        descriptor: invalidPackage,
      }),
    ).rejects.toThrow(AssertionError)
  })
})
