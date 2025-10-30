import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/minimum)", () => {
  it("should not report errors for valid values", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 30.0],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          constraints: { minimum: 5 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for invalid values", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 40, 3.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { minimum: 10 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/minimum")).toHaveLength(1)
    expect(errors).toContainEqual({
      type: "cell/minimum",
      fieldName: "temperature",
      minimum: "10",
      rowNumber: 4,
      cell: "3.5",
    })
  })

  it("should report an error for invalid values (exclusive)", async () => {
    const table = DataFrame({
      temperature: [20.5, 30.0, 10.0, 5.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMinimum: 10 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/exclusiveMinimum")).toHaveLength(
      2,
    )
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      fieldName: "temperature",
      minimum: "10",
      rowNumber: 3,
      cell: "10",
    })
    expect(errors).toContainEqual({
      type: "cell/exclusiveMinimum",
      fieldName: "temperature",
      minimum: "10",
      rowNumber: 4,
      cell: "5.5",
    })
  })

  it("should handle minimum as string", async () => {
    const table = DataFrame({
      price: [10.5, 20.75, 3.0],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          constraints: { minimum: "5" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "price",
        minimum: "5",
        rowNumber: 3,
        cell: "3",
      },
    ])
  })

  it("should handle exclusiveMinimum as string", async () => {
    const table = DataFrame({
      temperature: [20.5, 10.0, 5.5],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "temperature",
          type: "number",
          constraints: { exclusiveMinimum: "10" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/exclusiveMinimum",
        fieldName: "temperature",
        minimum: "10",
        rowNumber: 2,
        cell: "10",
      },
      {
        type: "cell/exclusiveMinimum",
        fieldName: "temperature",
        minimum: "10",
        rowNumber: 3,
        cell: "5.5",
      },
    ])
  })

  it("should handle minimum as string with groupChar", async () => {
    const table = DataFrame({
      price: ["5,000", "10,500", "2,500"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "integer",
          groupChar: ",",
          constraints: { minimum: "3,000" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "price",
        minimum: "3,000",
        rowNumber: 3,
        cell: "2,500",
      },
    ])
  })

  it("should handle minimum as string with decimalChar", async () => {
    const table = DataFrame({
      price: ["5,5", "10,75", "2,3"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          decimalChar: ",",
          constraints: { minimum: "3,0" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "price",
        minimum: "3,0",
        rowNumber: 3,
        cell: "2,3",
      },
    ])
  })

  it("should handle minimum as string with groupChar and decimalChar", async () => {
    const table = DataFrame({
      price: ["5.000,50", "10.500,75", "2.500,30"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          groupChar: ".",
          decimalChar: ",",
          constraints: { minimum: "3.000,00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "price",
        minimum: "3.000,00",
        rowNumber: 3,
        cell: "2.500,30",
      },
    ])
  })

  it("should handle minimum as string with bareNumber false", async () => {
    const table = DataFrame({
      price: ["$5.00", "$10.50", "$2.50"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "price",
          type: "number",
          bareNumber: false,
          constraints: { minimum: "$3.00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "price",
        minimum: "$3.00",
        rowNumber: 3,
        cell: "$2.50",
      },
    ])
  })

  it("should handle minimum for date fields", async () => {
    const table = DataFrame({
      date: ["2024-01-15", "2024-02-20", "2024-01-05"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "date",
          type: "date",
          constraints: { minimum: "2024-01-10" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "date",
        minimum: "2024-01-10",
        rowNumber: 3,
        cell: "2024-01-05",
      },
    ])
  })

  it.skip("should handle minimum for time fields", async () => {
    const table = DataFrame({
      time: ["14:30:00", "16:45:00", "12:15:00"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "time",
          type: "time",
          constraints: { minimum: "13:00:00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "time",
        minimum: "13:00:00",
        rowNumber: 3,
        cell: "12:15:00",
      },
    ])
  })

  it("should handle minimum for datetime fields", async () => {
    const table = DataFrame({
      timestamp: [
        "2024-01-15T14:30:00",
        "2024-02-20T08:15:00",
        "2024-01-10T10:00:00",
      ],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "timestamp",
          type: "datetime",
          constraints: { minimum: "2024-01-15T00:00:00" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "timestamp",
        minimum: "2024-01-15T00:00:00",
        rowNumber: 3,
        cell: "2024-01-10T10:00:00",
      },
    ])
  })

  it("should handle minimum for date fields with custom format", async () => {
    const table = DataFrame({
      date: ["15/01/2024", "20/02/2024", "05/01/2024"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "date",
          type: "date",
          format: "%d/%m/%Y",
          constraints: { minimum: "10/01/2024" },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })

    expect(errors).toEqual([
      {
        type: "cell/minimum",
        fieldName: "date",
        minimum: "10/01/2024",
        rowNumber: 3,
        cell: "05/01/2024",
      },
    ])
  })
})
