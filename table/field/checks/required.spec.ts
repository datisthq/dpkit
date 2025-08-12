import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("inspectTable (cell/required)", () => {
  it("should report a cell/required error", async () => {
    const table = DataFrame({
      id: [1, null, 3],
    }).lazy()

    const schema: Schema = {
      fields: [{ name: "id", type: "number", constraints: { required: true } }],
    }

    const errors = await inspectTable(table, { schema })

    expect(errors).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/required",
      fieldName: "id",
      rowNumber: 2,
      cell: "",
    })
  })
})
