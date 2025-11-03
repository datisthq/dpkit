import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../table/normalize.ts"
import { validateTable } from "../table/validate.ts"

describe("narrowField", () => {
  it("should narrow float to integer", async () => {
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["a", "b", "c"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const result = await normalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()).toEqual([
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
    ])
  })

  it("should detect error when float cannot be narrowed to integer", async () => {
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.5],
        name: ["a", "b", "c"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "id",
        fieldType: "integer",
        rowNumber: 3,
        cell: "3.5",
      },
    ])
  })
})
