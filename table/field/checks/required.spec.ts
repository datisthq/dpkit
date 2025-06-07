import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/required)", () => {
  it("should report a cell/required error", async () => {
    const table = DataFrame({
      id: [1, null, 3],
    }).lazy()

    const field: Field = {
      name: "id",
      type: "number",
      constraints: { required: true },
    }

    const polarsField: PolarsField = {
      name: "id",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/required",
      fieldName: "id",
      rowNumber: 2,
      cell: "",
    })
  })
})
