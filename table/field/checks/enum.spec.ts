import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/enum)", () => {
  it("should not report errors for string values that are in the enum", async () => {
    const table = pl
      .DataFrame({
        status: ["pending", "approved", "rejected", "pending"],
      })
      .lazy()

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

    const report = await validateTable(table, { schema })
    expect(report.errors).toHaveLength(0)
  })

  it("should report errors for values not in the enum", async () => {
    const allowedValues = ["pending", "approved", "rejected"]

    const table = pl
      .DataFrame({
        status: ["pending", "approved", "unknown", "cancelled", "rejected"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      enum: allowedValues,
      rowNumber: 3,
      cell: "unknown",
    })
    expect(report.errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      enum: allowedValues,
      rowNumber: 4,
      cell: "cancelled",
    })
  })

  it("should handle null values correctly", async () => {
    const table = pl
      .DataFrame({
        status: ["pending", null, "approved", null],
      })
      .lazy()

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

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "cell/enum")).toHaveLength(0)
  })

  it("should handle case sensitivity correctly", async () => {
    const allowedValues = ["pending", "approved", "rejected"]

    const table = pl
      .DataFrame({
        status: ["Pending", "APPROVED", "rejected"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })
    expect(report.errors.filter(e => e.type === "cell/enum")).toHaveLength(2)
    expect(report.errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      enum: allowedValues,
      rowNumber: 1,
      cell: "Pending",
    })
    expect(report.errors).toContainEqual({
      type: "cell/enum",
      fieldName: "status",
      enum: allowedValues,
      rowNumber: 2,
      cell: "APPROVED",
    })
  })

  it("should handle integer enum with string values", async () => {
    const allowedValues = ["1", "2", "3"]

    const table = pl
      .DataFrame({
        priority: ["1", "2", "5"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "priority",
          type: "integer",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "priority",
        enum: allowedValues,
        rowNumber: 3,
        cell: "5",
      },
    ])
  })

  it("should handle number enum with string values", async () => {
    const allowedValues = ["1.5", "2.5", "3.5"]

    const table = pl
      .DataFrame({
        rating: ["1.5", "2.5", "4.5"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "rating",
          type: "number",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "rating",
        enum: allowedValues,
        rowNumber: 3,
        cell: "4.5",
      },
    ])
  })

  it.skip("should handle date enum with string values", async () => {
    const allowedValues = ["2024-01-01", "2024-02-01", "2024-03-01"]

    const table = pl
      .DataFrame({
        date: ["2024-01-01", "2024-02-01", "2024-05-01"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "date",
          type: "date",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "date",
        enum: allowedValues,
        rowNumber: 3,
        cell: "2024-05-01",
      },
    ])
  })

  it.skip("should handle datetime enum with string values", async () => {
    const allowedValues = [
      "2024-01-01T10:00:00",
      "2024-01-01T14:00:00",
      "2024-01-01T18:00:00",
    ]

    const table = pl
      .DataFrame({
        timestamp: [
          "2024-01-01T10:00:00",
          "2024-01-01T14:00:00",
          "2024-01-01T20:00:00",
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "timestamp",
          type: "datetime",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "timestamp",
        enum: allowedValues,
        rowNumber: 3,
        cell: "2024-01-01T20:00:00",
      },
    ])
  })

  it("should handle year enum with string values", async () => {
    const allowedValues = ["2020", "2021", "2022"]

    const table = pl
      .DataFrame({
        year: ["2020", "2021", "2023"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "year",
          type: "year",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "year",
        enum: allowedValues,
        rowNumber: 3,
        cell: "2023",
      },
    ])
  })

  it.skip("should handle time enum with string values", async () => {
    const allowedValues = ["10:00:00", "14:00:00", "18:00:00"]

    const table = pl
      .DataFrame({
        time: ["10:00:00", "14:00:00", "20:00:00"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "time",
          type: "time",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "time",
        enum: allowedValues,
        rowNumber: 3,
        cell: "20:00:00",
      },
    ])
  })

  it.skip("should handle yearmonth enum with string values", async () => {
    const allowedValues = ["2024-01", "2024-02", "2024-03"]

    const table = pl
      .DataFrame({
        yearmonth: ["2024-01", "2024-02", "2024-05"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "yearmonth",
          type: "yearmonth",
          constraints: {
            enum: allowedValues,
          },
        },
      ],
    }

    const report = await validateTable(table, { schema })

    expect(report.errors).toEqual([
      {
        type: "cell/enum",
        fieldName: "yearmonth",
        enum: allowedValues,
        rowNumber: 3,
        cell: "2024-05",
      },
    ])
  })
})
