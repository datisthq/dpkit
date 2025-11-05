import type { Schema } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("inspectTable (cell/minLength)", () => {
  it("should not errors for string values that meet the minLength constraint", async () => {
    const table = pl
      .DataFrame({
        code: ["A123", "B456", "C789"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "code",
          type: "string",
          constraints: { minLength: 3 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too short", async () => {
    const table = pl
      .DataFrame({
        username: ["bob", "a", "christopher", "ab"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "username",
          type: "string",
          constraints: { minLength: 3 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/minLength")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/minLength",
      fieldName: "username",
      minLength: 3,
      rowNumber: 2,
      cell: "a",
    })
    expect(errors).toContainEqual({
      type: "cell/minLength",
      fieldName: "username",
      minLength: 3,
      rowNumber: 4,
      cell: "ab",
    })
  })
})
