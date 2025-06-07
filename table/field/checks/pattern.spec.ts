import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/pattern)", () => {
  it("should not report errors for string values that match the pattern", async () => {
    const table = DataFrame({
      email: ["john@example.com", "alice@domain.org", "test@test.io"],
    }).lazy()

    const field: Field = {
      name: "email",
      type: "string",
      constraints: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      },
    }

    const polarsField: PolarsField = {
      name: "email",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that don't match the pattern", async () => {
    const table = DataFrame({
      email: ["john@example.com", "alice@domain", "test.io", "valid@email.com"],
    }).lazy()

    const field: Field = {
      name: "email",
      type: "string",
      constraints: {
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      },
    }

    const polarsField: PolarsField = {
      name: "email",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
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
