import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("inspectTable (cell/maxLength)", () => {
  it("should not errors for string values that meet the maxLength constraint", async () => {
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
          constraints: { maxLength: 4 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too long", async () => {
    const table = pl
      .DataFrame({
        username: ["bob", "alice", "christopher", "david"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "username",
          type: "string",
          constraints: { maxLength: 8 },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/maxLength")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/maxLength",
      fieldName: "username",
      maxLength: 8,
      rowNumber: 3,
      cell: "christopher",
    })
  })
})
