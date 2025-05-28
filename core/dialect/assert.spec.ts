import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../general/index.js"
import type { Dialect } from "./Dialect.js"
import { assertDialect } from "./assert.js"

describe("assertDialect", () => {
  it("returns typed dialect when valid", async () => {
    const descriptor = {
      delimiter: ";",
      header: true,
      skipInitialSpace: true,
    }

    const dialect = await assertDialect({
      descriptor,
    })

    expectTypeOf(dialect).toEqualTypeOf<Dialect>()
    expect(dialect).toEqual(descriptor)
  })

  it("throws ValidationError when dialect is invalid", async () => {
    const invalidDialect = {
      delimiter: 1, // Should be a string
      header: "yes", // Should be a boolean
    }

    await expect(
      assertDialect({
        descriptor: invalidDialect,
      }),
    ).rejects.toThrow(AssertionError)
  })
})
