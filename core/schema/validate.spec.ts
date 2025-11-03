import { describe, expect, it } from "vitest"
import { validateSchema } from "./validate.ts"

describe("validateSchema", () => {
  it("returns empty array for valid schema", async () => {
    const descriptor = {
      fields: [
        {
          name: "id",
          type: "integer",
        },
        {
          name: "name",
          type: "string",
        },
      ],
    }

    const report = await validateSchema(descriptor)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("returns validation errors for invalid schema", async () => {
    const descriptor = {
      fields: [
        {
          name: "id",
          type: 123, // Should be a string
        },
      ],
    }

    const report = await validateSchema(descriptor)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toBeGreaterThan(0)

    const error = report.errors[0]
    expect(error).toBeDefined()
    if (error) {
      // The error could be either type or enum depending on schema validation
      expect(["type", "enum"]).toContain(error.keyword)
      expect(error.instancePath).toContain("/fields/0/type")
    }
  })
})
