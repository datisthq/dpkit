import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

// TODO: recover
describe("validateTable (cell/unique)", () => {
  it("should not report errors when all values are unique", async () => {
    const table = DataFrame({
      id: [1, 2, 3, 4, 5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "id",
          type: "number",
          constraints: { unique: true },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for duplicate values", async () => {
    const table = DataFrame({
      id: [1, 2, 3, 2, 5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "id",
          type: "number",
          constraints: { unique: true },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors.filter(e => e.type === "cell/unique")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "id",
      rowNumber: 4,
      cell: "2",
    })
  })

  it("should report multiple errors for string duplicates", async () => {
    const table = DataFrame({
      code: ["A001", "B002", "A001", "C003", "B002"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "code",
          type: "string",
          constraints: { unique: true },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/unique")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "code",
      rowNumber: 3,
      cell: "A001",
    })
    expect(errors).toContainEqual({
      type: "cell/unique",
      fieldName: "code",
      rowNumber: 5,
      cell: "B002",
    })
  })

  it("should handle null values correctly", async () => {
    const table = DataFrame({
      id: [1, null, 3, null, 5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "id",
          type: "number",
          constraints: { unique: true },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })
})
