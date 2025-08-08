import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("inspectTable (cell/enum)", () => {
  it("should not report errors for string values that are in the enum", async () => {
    const table = DataFrame({
      status: ["pending", "approved", "rejected", "pending"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: ["pending", "approved", "rejected"],
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for values not in the enum", async () => {
    const table = DataFrame({
      status: ["pending", "approved", "unknown", "cancelled", "rejected"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: ["pending", "approved", "rejected"],
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 3,
      cell: "unknown",
    })
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 4,
      cell: "cancelled",
    })
  })

  it("should handle null values correctly", async () => {
    const table = DataFrame({
      status: ["pending", null, "approved", null],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: ["pending", "approved", "rejected"],
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(0)
  })

  it("should handle case sensitivity correctly", async () => {
    const table = DataFrame({
      status: ["Pending", "APPROVED", "rejected"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: ["pending", "approved", "rejected"],
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 1,
      cell: "Pending",
    })
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 2,
      cell: "APPROVED",
    })
  })
})
