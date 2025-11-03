import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/pattern)", () => {
  it("should not report errors for string values that match the pattern", async () => {
    const table = pl
      .DataFrame({
        email: ["john@example.com", "alice@domain.org", "test@test.io"],
      })
      .lazy()

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

    const report = await validateTable(table, { schema })
    expect(report.errors).toHaveLength(0)
  })

  it("should report an error for strings that don't match the pattern", async () => {
    const pattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

    const table = pl
      .DataFrame({
        email: [
          "john@example.com",
          "alice@domain",
          "test.io",
          "valid@email.com",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "email",
          type: "string",
          constraints: {
            pattern,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "cell/pattern")).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "cell/pattern",
      fieldName: "email",
      pattern,
      rowNumber: 2,
      cell: "alice@domain",
    })
    expect(report.errors).toContainEqual({
      type: "cell/pattern",
      fieldName: "email",
      pattern,
      rowNumber: 3,
      cell: "test.io",
    })
  })
})
