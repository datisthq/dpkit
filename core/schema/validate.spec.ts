import { describe, expect, it } from "vitest"
import { validateSchema } from "./validate.js"

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

    const result = await validateSchema(descriptor)

    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
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

    const result = await validateSchema(descriptor)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)

    const error = result.errors[0]
    expect(error).toBeDefined()
    if (error) {
      // The error could be either type or enum depending on schema validation
      expect(["type", "enum"]).toContain(error.keyword)
      expect(error.instancePath).toContain("/fields/0/type")
    }
  })
})
