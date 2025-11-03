import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (row/unique)", () => {
  it("should not report errors when all rows are unique for primary key", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 4, 5],
        name: ["Alice", "Bob", "Charlie", "David", "Eve"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
      ],
      primaryKey: ["id"],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors).toHaveLength(0)
  })

  it("should report errors for duplicate primary key rows", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 2, 5],
        name: ["Alice", "Bob", "Charlie", "Bob2", "Eve"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
      ],
      primaryKey: ["id"],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors.filter(e => e.type === "row/unique")).toHaveLength(1)
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 4,
      fieldNames: ["id"],
    })
  })

  it("should not report errors when all rows are unique for unique key", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 4, 5],
        email: [
          "a@test.com",
          "b@test.com",
          "c@test.com",
          "d@test.com",
          "e@test.com",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "email", type: "string" },
      ],
      uniqueKeys: [["email"]],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors).toHaveLength(0)
  })

  it("should report errors for duplicate unique key rows", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 4, 5],
        email: [
          "a@test.com",
          "b@test.com",
          "a@test.com",
          "d@test.com",
          "b@test.com",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "email", type: "string" },
      ],
      uniqueKeys: [["email"]],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "row/unique")).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 3,
      fieldNames: ["email"],
    })
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 5,
      fieldNames: ["email"],
    })
  })

  it("should handle composite unique keys", async () => {
    const table = pl
      .DataFrame({
        category: ["A", "A", "B", "A", "B"],
        subcategory: ["X", "Y", "X", "X", "Y"],
        value: [1, 2, 3, 4, 5],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "category", type: "string" },
        { name: "subcategory", type: "string" },
        { name: "value", type: "number" },
      ],
      uniqueKeys: [["category", "subcategory"]],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "row/unique")).toHaveLength(1)
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 4,
      fieldNames: ["category", "subcategory"],
    })
  })

  it("should handle both primary key and unique keys", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, 3, 2, 5],
        email: [
          "a@test.com",
          "b@test.com",
          "c@test.com",
          "d@test.com",
          "a@test.com",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "email", type: "string" },
      ],
      primaryKey: ["id"],
      uniqueKeys: [["email"]],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "row/unique")).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 4,
      fieldNames: ["id"],
    })
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 5,
      fieldNames: ["email"],
    })
  })

  it("should handle null values in unique keys correctly", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2, null, 4, null, 2],
        name: ["Alice", "Bob", "Charlie", "David", "Eve", "Bob"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
      ],
      uniqueKeys: [["id"], ["id", "name"]],
    }

    const report = await validateTable(table, { schema })
    console.log(report.errors)

    expect(report.errors).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 6,
      fieldNames: ["id"],
    })
    expect(report.errors).toContainEqual({
      type: "row/unique",
      rowNumber: 6,
      fieldNames: ["id", "name"],
    })
  })
})
