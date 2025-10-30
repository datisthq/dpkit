import { describe, expect, it } from "vitest"
import { validateResource } from "./validate.ts"

describe("validateResource", () => {
  it("should catch validation errors for invalid tabular data", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { id: 1, name: "Alice", active: true },
        { id: 2, name: "Bob", active: 123 },
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
          { name: "active", type: "boolean" as const },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toEqual(1)
  })

  it("should validate correct tabular data", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { name: "Alice", active: true },
        { name: "Bob", active: false },
      ],
      schema: {
        fields: [
          { name: "name", type: "string" as const },
          { name: "active", type: "boolean" as const },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should catch multiple validation errors", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { id: 1, name: "Alice", age: 25 },
        { id: "not-a-number", name: "Bob", age: "not-a-number" },
        { id: 3, name: "Charlie", age: -5 },
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
          {
            name: "age",
            type: "integer" as const,
            constraints: { minimum: 0 },
          },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toEqual(3)
  })
})
