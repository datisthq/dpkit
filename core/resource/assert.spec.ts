import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../error/index.ts"
import type { Resource } from "./Resource.ts"
import { assertResource } from "./assert.ts"

describe("assertResource", () => {
  it("returns typed resource when valid", async () => {
    const descriptor = {
      name: "example-resource",
      path: "data.csv",
      format: "csv",
      encoding: "utf-8",
    }

    const resource = await assertResource(descriptor)

    expectTypeOf(resource).toEqualTypeOf<Resource>()
    expect(resource).toEqual(descriptor)
  })

  it("throws AssertionError when resource is invalid", async () => {
    const invalidResource = {
      name: 123, // Should be a string
      path: true, // Should be a string or array of strings
    }

    await expect(assertResource(invalidResource)).rejects.toThrow(
      AssertionError,
    )
  })
})
