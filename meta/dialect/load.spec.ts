import * as path from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Dialect } from "./Dialect.js"
import { loadDialect } from "./load.js"

describe("loadDialect", () => {
  const basePath = path.join(import.meta.dirname, "fixtures")
  const baseUrl =
    "https://raw.githubusercontent.com/frictionlessdata/dplib-py/refs/heads/main/data"
  const descriptor = {
    delimiter: ";",
  }

  it("loads a dialect from a local file path", async () => {
    const dialect = await loadDialect({ path: `${basePath}/dialect.json` })

    expectTypeOf(dialect).toEqualTypeOf<Dialect>()
    expect(dialect).toEqual(descriptor)
  })

  it("loads a dialect from a remote URL", async () => {
    const dialect = await loadDialect({ path: `${baseUrl}/dialect.json` })

    expectTypeOf(dialect).toEqualTypeOf<Dialect>()
    expect(dialect).toEqual(descriptor)
  })
})
