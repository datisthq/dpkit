import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/maximum)", () => {
  it("should not report errors for valid values", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 30.0],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          constraints: { maximum: 50 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for invalid values", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40, 50.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { maximum: 40 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/maximum")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/maximum",
      fieldName: "temperature",
      maximum: "40",
      rowNumber: 4,
      cell: "50.5",
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40.0, 50.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMaximum: 40 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/exclusiveMaximum")).toHaveLength(
      2,
    )
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      maximum: "40",
      rowNumber: 3,
      cell: "40",
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMaximum",
      fieldName: "temperature",
      maximum: "40",
      rowNumber: 4,
      cell: "50.5",
    })
  })

  it("should handle maximum as string", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 55.0],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          constraints: { maximum: "50" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "price",
        maximum: "50",
        rowNumber: 3,
        cell: "55",
      },
    ])
  })

  it("should handle exclusiveMaximum as string", async () => {
    const table = DataFrame({
      temperature: [20.5, 40.0, 50.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMaximum: "40" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMaximum",
        fieldName: "temperature",
        maximum: "40",
        rowNumber: 2,
        cell: "40",
      },
      {
        type: "cell/exclusiveMaximum",
        fieldName: "temperature",
        maximum: "40",
        rowNumber: 3,
        cell: "50.5",
      },
    ])
  })

  it("should handle maximum as string with groupChar", async () => {
    const table = DataFrame({
      price: ["5,000", "10,500", "15,000"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "integer",
          groupChar: ",",
          constraints: { maximum: "12,000" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "price",
        maximum: "12,000",
        rowNumber: 3,
        cell: "15,000",
      },
    ])
  })

  it("should handle maximum as string with decimalChar", async () => {
    const table = DataFrame({
      price: ["5,5", "10,75", "15,3"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          decimalChar: ",",
          constraints: { maximum: "12,0" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "price",
        maximum: "12,0",
        rowNumber: 3,
        cell: "15,3",
      },
    ])
  })

  it("should handle maximum as string with groupChar and decimalChar", async () => {
    const table = DataFrame({
      price: ["5.000,50", "10.500,75", "15.000,30"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          groupChar: ".",
          decimalChar: ",",
          constraints: { maximum: "12.000,00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "price",
        maximum: "12.000,00",
        rowNumber: 3,
        cell: "15.000,30",
      },
    ])
  })

  it("should handle maximum as string with bareNumber false", async () => {
    const table = DataFrame({
      price: ["$5.00", "$10.50", "$15.50"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          bareNumber: false,
          constraints: { maximum: "$12.00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "price",
        maximum: "$12.00",
        rowNumber: 3,
        cell: "$15.50",
      },
    ])
  })

  it("should handle maximum for date fields", async () => {
    const table = DataFrame({
      date: ["2024-01-15", "2024-02-20", "2024-03-25"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "date",
          type: "date",
          constraints: { maximum: "2024-02-28" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "date",
        maximum: "2024-02-28",
        rowNumber: 3,
        cell: "2024-03-25",
      },
    ])
  })

  it.skip("should handle maximum for time fields", async () => {
    const table = DataFrame({
      time: ["14:30:00", "16:45:00", "18:00:00"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "time",
          type: "time",
          constraints: { maximum: "17:00:00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "time",
        maximum: "17:00:00",
        rowNumber: 3,
        cell: "18:00:00",
      },
    ])
  })

  it("should handle maximum for datetime fields", async () => {
    const table = DataFrame({
      timestamp: [
        "2024-01-15T14:30:00",
        "2024-02-20T08:15:00",
        "2024-03-25T10:00:00",
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "timestamp",
          type: "datetime",
          constraints: { maximum: "2024-02-28T23:59:59" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "timestamp",
        maximum: "2024-02-28T23:59:59",
        rowNumber: 3,
        cell: "2024-03-25T10:00:00",
      },
    ])
  })

  it("should handle maximum for date fields with custom format", async () => {
    const table = DataFrame({
      date: ["15/01/2024", "20/02/2024", "25/03/2024"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "date",
          type: "date",
          format: "%d/%m/%Y",
          constraints: { maximum: "28/02/2024" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "date",
        maximum: "28/02/2024",
        rowNumber: 3,
        cell: "25/03/2024",
      },
    ])
  })

  it("should handle maximum for year fields", async () => {
    const table = DataFrame({
      year: ["2020", "2021", "2023"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "year",
          type: "year",
          constraints: { maximum: "2022" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "year",
        maximum: "2022",
        rowNumber: 3,
        cell: "2023",
      },
    ])
  })

  it("should handle exclusiveMaximum for year fields", async () => {
    const table = DataFrame({
      year: ["2020", "2021", "2022", "2023"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "year",
          type: "year",
          constraints: { exclusiveMaximum: "2022" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMaximum",
        fieldName: "year",
        maximum: "2022",
        rowNumber: 3,
        cell: "2022",
      },
      {
        type: "cell/exclusiveMaximum",
        fieldName: "year",
        maximum: "2022",
        rowNumber: 4,
        cell: "2023",
      },
    ])
  })

  it.skip("should handle maximum for yearmonth fields", async () => {
    const table = DataFrame({
      yearmonth: ["2024-01", "2024-03", "2024-06"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "yearmonth",
          type: "yearmonth",
          constraints: { maximum: "2024-05" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/maximum",
        fieldName: "yearmonth",
        maximum: "2024-05",
        rowNumber: 3,
        cell: "2024-06",
      },
    ])
  })

  it.skip("should handle exclusiveMaximum for yearmonth fields", async () => {
    const table = DataFrame({
      yearmonth: ["2024-01", "2024-03", "2024-05", "2024-06"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "yearmonth",
          type: "yearmonth",
          constraints: { exclusiveMaximum: "2024-05" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMaximum",
        fieldName: "yearmonth",
        maximum: "2024-05",
        rowNumber: 3,
        cell: "2024-05",
      },
      {
        type: "cell/exclusiveMaximum",
        fieldName: "yearmonth",
        maximum: "2024-05",
        rowNumber: 4,
        cell: "2024-06",
      },
    ])
  })
})
