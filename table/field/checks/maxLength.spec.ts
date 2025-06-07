import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/maxLength)", () => {
  it("should not report errors for string values that meet the maxLength constraint", async () => {
    const table = DataFrame({
      code: ["A123", "B456", "C789"],
    }).lazy()

    const field: Field = {
      name: "code",
      type: "string",
      constraints: { maxLength: 4 }, // Maximum code length is 4 characters
    }

    const polarsField: PolarsField = {
      name: "code",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too long", async () => {
    const table = DataFrame({
      username: ["bob", "alice", "christopher", "david"],
    }).lazy()

    const field: Field = {
      name: "username",
      type: "string",
      constraints: { maxLength: 8 }, // Maximum username length is 8 characters
    }

    const polarsField: PolarsField = {
      name: "username",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/maxLength")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/maxLength",
      fieldName: "username",
      rowNumber: 3, // Third row (christopher)
      cell: "christopher",
    })
  })
})
