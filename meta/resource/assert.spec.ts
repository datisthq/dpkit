import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { assertResource } from "./assert.js"

describe("assertResource", () => {
  it("returns typed resource when valid", async () => {
    const validResource: Resource = {
      name: "example-resource",
      path: "data.csv",
      format: "csv",
      encoding: "utf-8",
    }

    const result = await assertResource({
      descriptor: validResource,
    })

    expectTypeOf(result).toEqualTypeOf<Resource>()
    expect(result).toEqual(validResource)
  })

  it("throws AssertionError when resource is invalid", async () => {
    const invalidResource = {
      name: 123, // Should be a string
      path: true, // Should be a string or array of strings
    }

    await expect(
      assertResource({
        descriptor: invalidResource,
      }),
    ).rejects.toThrow(AssertionError)
  })
})
