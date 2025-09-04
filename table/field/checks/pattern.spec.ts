import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/pattern)", () => {
  it("should not report errors for string values that match the pattern", async () => {
    const table = DataFrame({
      email: ["john@example.com", "alice@domain.org", "test@test.io"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "email",
          type: "string",
          constraints: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
        },
      ],
    }

    const errors = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that don't match the pattern", async () => {
    const table = DataFrame({
      email: ["john@example.com", "alice@domain", "test.io", "valid@email.com"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "email",
          type: "string",
          constraints: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
        },
      ],
    }

    const errors = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/pattern")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/pattern",
      fieldName: "email",
      rowNumber: 2, // Second row (alice@domain)
      cell: "alice@domain",
    })
    expect(errors).toContainEqual({
      type: "cell/pattern",
      fieldName: "email",
      rowNumber: 3, // Third row (test.io)
      cell: "test.io",
    })
  })
})
