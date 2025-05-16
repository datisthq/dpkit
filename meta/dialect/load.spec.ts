import { join } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Dialect } from "./Dialect.js"
import { loadDialect } from "./load.js"

describe("loadDialect", async () => {
  const getFixturePath = (name: string) => join(__dirname, "fixtures", name)
  const descriptor = {
    delimiter: ";",
  }

  it("loads a dialect from a local file path", async () => {
    const dialect = await loadDialect({ path: getFixturePath("dialect.json") })
    expectTypeOf(dialect).toEqualTypeOf<Dialect>()
    expect(dialect).toEqual(descriptor)
  })

  it("throws an error when dialect is invalid", async () => {
    await expect(
      loadDialect({ path: getFixturePath("dialect-invalid.json") }),
    ).rejects.toThrow()
  })
})
