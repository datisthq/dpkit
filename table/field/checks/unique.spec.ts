import type { Field } from "@dpkit/core"
import { DataFrame, DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import type { PolarsField } from "../../field/index.js"
import { validateField } from "../validate.js"

describe("validateField (cell/unique)", () => {
  it("should not report errors when all values are unique", async () => {
    const table = DataFrame({
      id: [1, 2, 3, 4, 5],
    }).lazy()

    const field: Field = {
      name: "id",
      type: "integer",
      constraints: { unique: true },
    }

    const polarsField: PolarsField = {
      name: "id",
      type: DataType.Int32,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for duplicate values", async () => {
    const table = DataFrame({
      id: [1, 2, 3, 2, 5],
    }).lazy()

    const field: Field = {
      name: "id",
      type: "integer",
      constraints: { unique: true },
    }

    const polarsField: PolarsField = {
      name: "id",
      type: DataType.Int32,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/unique")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "id",
      rowNumber: 4, // Fourth row (duplicate value of 2)
      cell: 2,
    })
  })

  it("should report multiple errors for string duplicates", async () => {
    const table = DataFrame({
      code: ["A001", "B002", "A001", "C003", "B002"],
    }).lazy()

    const field: Field = {
      name: "code",
      type: "string",
      constraints: { unique: true },
    }

    const polarsField: PolarsField = {
      name: "code",
      type: DataType.String,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors.filter(e => e.type === "cell/unique")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "code",
      rowNumber: 3, // Third row (duplicate value of "A001")
      cell: "A001",
    })
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "code",
      rowNumber: 5, // Fifth row (duplicate value of "B002")
      cell: "B002",
    })
  })

  it("should handle null values correctly", async () => {
    const table = DataFrame({
      id: [1, null, 3, null, 5],
    }).lazy()

    const field: Field = {
      name: "id",
      type: "integer",
      constraints: { unique: true },
    }

    const polarsField: PolarsField = {
      name: "id",
      type: DataType.Int32,
    }

    const errors = await validateField(field, { table, polarsField })
    expect(errors).toHaveLength(0)
  })
})
