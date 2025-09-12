import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/maximum)", () => {
  it("should not report errors for valid values", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 30.0],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          constraints: { maximum: 50 },
        },
      ],
    }

    const errors = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for invalid values", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40, 50.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { maximum: 40 },
        },
      ],
    }

    const errors = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/maximum")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/maximum",
      fieldName: "temperature",
      rowNumber: 4,
      cell: "50.5",
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40.0, 50.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMaximum: 40 },
        },
      ],
    }

    const errors = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/exclusiveMaximum")).toHaveLength(
      2,
    )
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      rowNumber: 3,
      cell: "40",
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      rowNumber: 4,
      cell: "50.5",
    })
  })
})
