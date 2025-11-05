import { describe, expect, expectTypeOf, it } from "vitest"
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

  it("throws Error when resource is invalid", async () => {
    const invalidResource = {
      name: 123,
      path: true,
    }

    await expect(assertResource(invalidResource)).rejects.toThrow(Error)
  })
})
