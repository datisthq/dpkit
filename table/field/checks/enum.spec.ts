import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/enum)", () => {
  it("should not report errors for string values that are in the enum", async () => {
    const table = DataFrame({
      status: ["pending", "approved", "rejected", "pending"],
    }).lazy()

    const field: Field = {
      name: "status",
      type: "string",
      constraints: {
        enum: ["pending", "approved", "rejected"],
      },
    }

    const polarsField: PolarsField = {
      name: "status",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for values not in the enum", async () => {
    const table = DataFrame({
      status: ["pending", "approved", "unknown", "cancelled", "rejected"],
    }).lazy()

    const field: Field = {
      name: "status",
      type: "string",
      constraints: {
        enum: ["pending", "approved", "rejected"],
      },
    }

    const polarsField: PolarsField = {
      name: "status",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 3, // Third row ("unknown")
      cell: "unknown",
    })
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 4, // Fourth row ("cancelled")
      cell: "cancelled",
    })
  })

  it("should handle null values correctly", async () => {
    const table = DataFrame({
      status: ["pending", null, "approved", null],
    }).lazy()

    const field: Field = {
      name: "status",
      type: "string",
      constraints: {
        enum: ["pending", "approved", "rejected"],
      },
    }

    const polarsField: PolarsField = {
      name: "status",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(0)
  })

  it("should handle case sensitivity correctly", async () => {
    const table = DataFrame({
      status: ["Pending", "APPROVED", "rejected"],
    }).lazy()

    const field: Field = {
      name: "status",
      type: "string",
      constraints: {
        enum: ["pending", "approved", "rejected"],
      },
    }

    const polarsField: PolarsField = {
      name: "status",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 1, // First row ("Pending")
      cell: "Pending",
    })
    expect(errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      rowNumber: 2, // Second row ("APPROVED")
      cell: "APPROVED",
    })
  })
})
