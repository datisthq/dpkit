import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/maximum)", () => {
  it("should not report errors for valid values", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 30.0],
    }).lazy()

    const field: Field = {
      name: "price",
      type: "number",
      constraints: { maximum: 50 }, // Maximum price is 50
    }

    const polarsField: PolarsField = {
      name: "price",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for invalid values", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40, 50.5],
    }).lazy()

    const field: Field = {
      name: "temperature",
      type: "number",
      constraints: { maximum: 40 }, // Maximum temperature is 40
    }

    const polarsField: PolarsField = {
      name: "temperature",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/maximum",
      fieldName: "temperature",
      rowNumber: 4,
      cell: 50.5,
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40.0, 50.5],
    }).lazy()

    const field: Field = {
      name: "temperature",
      type: "number",
      constraints: { exclusiveMaximum: 40 }, // Values must be < 40
    }

    const polarsField: PolarsField = {
      name: "temperature",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      rowNumber: 3,
      cell: 40.0,
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      rowNumber: 4,
      cell: 50.5,
    })
  })
})
