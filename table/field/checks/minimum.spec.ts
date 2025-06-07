import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/minimum)", () => {
  it("should not report errors for valid values", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 30.0],
    }).lazy()

    const field: Field = {
      name: "price",
      type: "number",
      constraints: { minimum: 10 }, // Minimum price is 10
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
      temperature: [-10.5, 0.0, 10.5, 20.5],
    }).lazy()

    const field: Field = {
      name: "temperature",
      type: "number",
      constraints: { minimum: 0 }, // Minimum temperature is 0
    }

    const polarsField: PolarsField = {
      name: "temperature",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/minimum",
      fieldName: "temperature",
      rowNumber: 1,
      cell: -10.5,
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = DataFrame({
      temperature: [-10.5, 0.0, 10.5, 20.5],
    }).lazy()

    const field: Field = {
      name: "temperature",
      type: "number",
      constraints: { exclusiveMinimum: 0 }, // Minimum temperature is 0
    }

    const polarsField: PolarsField = {
      name: "temperature",
      type: DataType.Float64,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      fieldName: "temperature",
      rowNumber: 1,
      cell: -10.5,
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      fieldName: "temperature",
      rowNumber: 2,
      cell: 0,
    })
  })
})
