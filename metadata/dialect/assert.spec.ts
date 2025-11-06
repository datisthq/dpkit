import { describe, expect, expectTypeOf, it } from "vitest"
import type { Dialect } from "./Dialect.ts"
import { assertDialect } from "./assert.ts"

describe("assertDialect", () => {
  it("returns typed dialect when valid", async () => {
    const descriptor = {
      delimiter: ";",
      header: true,
      skipInitialSpace: true,
    }

    const dialect = await assertDialect(descriptor)

    expectTypeOf(dialect).toEqualTypeOf<Dialect>()
    expect(dialect).toEqual(descriptor)
  })

  it("throws Error when dialect is invalid", async () => {
    const invalidDialect = {
      delimiter: 1,
      header: "yes",
    }

    await expect(assertDialect(invalidDialect)).rejects.toThrow(Error)
  })
})
