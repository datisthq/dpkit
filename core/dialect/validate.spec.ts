import { describe, expect, it } from "vitest"
import type { Dialect } from "./Dialect.js"
import { validateDialect } from "./validate.js"

describe("validateDialect", () => {
  it("returns valid result for valid dialect", async () => {
    const validDialect: Dialect = {
      delimiter: ";",
    }

    const result = await validateDialect({
      descriptor: validDialect,
    })

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it("returns validation errors for invalid dialect", async () => {
    const invalidDialect = {
      delimiter: 1, // Should be a string
    }

    const result = await validateDialect({
      descriptor: invalidDialect,
    })

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.keyword).toBe("type")
      expect(error.instancePath).toBe("/delimiter")
    }
  })
})
