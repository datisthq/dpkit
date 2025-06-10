import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { assertResource } from "./assert.js"

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
