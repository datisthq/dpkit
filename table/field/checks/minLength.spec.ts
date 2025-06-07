import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/minLength)", () => {
  it("should not report errors for string values that meet the minLength constraint", async () => {
    const table = DataFrame({
      name: ["John", "Elizabeth", "Alexander"],
    }).lazy()

    const field: Field = {
      name: "name",
      type: "string",
      constraints: { minLength: 4 }, // Minimum name length is 4 characters
    }

    const polarsField: PolarsField = {
      name: "name",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too short", async () => {
    const table = DataFrame({
      name: ["Bob", "Alice", "Jo", "Christopher"],
    }).lazy()

    const field: Field = {
      name: "name",
      type: "string",
      constraints: { minLength: 3 }, // Minimum name length is 3 characters
    }

    const polarsField: PolarsField = {
      name: "name",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/minLength")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/minLength",
      fieldName: "name",
      rowNumber: 3, // Third row (Jo)
      cell: "Jo",
    })
  })
})
