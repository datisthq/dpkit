import { describe, expect, it } from "vitest"
import { validateDialect } from "./validate.ts"

describe("validateDialect", () => {
  it("returns valid report for valid dialect", async () => {
    const descriptor = {
      delimiter: ";",
    }

    const report = await validateDialect({
      descriptor,
    })

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid dialect", async () => {
    const invalidDialect = {
      delimiter: 1, // Should be a string
    }

    const report = await validateDialect(invalidDialect)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      expect(error.pointer).toBe("/delimiter")
    }
  })
})
