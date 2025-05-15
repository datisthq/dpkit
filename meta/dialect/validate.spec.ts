import { describe, expect, it } from "vitest"
import type { Dialect } from "./Dialect.js"
import { validateDialect } from "./validate.js"

describe("validateDialect", () => {
  it("returns empty array for valid dialect", async () => {
    const validDialect: Dialect = {
      delimiter: ";",
    }

    const result = await validateDialect({
      descriptor: validDialect,
    })

    expect(result).toEqual([])
  })

  it("returns validation errors for invalid dialect", async () => {
    const invalidDialect = {
      delimiter: 1, // Should be a string
    }

    const result = await validateDialect({
      descriptor: invalidDialect,
    })

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    const error = result[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
      expect(error.instancePath).toBe("/delimiter")
    }
  })
})
