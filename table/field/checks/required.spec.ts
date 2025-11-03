import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/required)", () => {
  it("should report a cell/required error", async () => {
    const table = pl
      .DataFrame({
        id: [1, null, 3],
      })
      .lazy()

    const schema: Schema = {
      fields: [{ name: "id", type: "number", constraints: { required: true } }],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toHaveLength(1)
    expect(report.errors).toContainEqual({
      type: "cell/required",
      fieldName: "id",
      rowNumber: 2,
      cell: "",
    })
  })
})
