import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

describe("parseYearField", () => {
  it.each([
    // Tests ported from frictionless-py (string values only)
    ["2000", 2000],
    ["-2000", null],
    ["20000", null],
    ["3.14", null],
    ["", null],

    // Additional tests for completeness
    ["0000", 0],
    ["9999", 9999],
    //[" 2023 ", 2023],
    //["  1984  ", 1984],
    ["bad", null],
    ["12345", null],
    ["123", null],
  ])("%s -> %s", async (cell, value) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "year" as const }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})

describe("stringifyYearField", () => {
  it.each([
    // Basic integer years to string conversion
    [2000, "2000"],
    [2023, "2023"],
    [1999, "1999"],
    [0, "0"],
    [9999, "9999"],

    // Edge cases with null values
    [null, ""],
  ])("%s -> %s", async (value, expected) => {
    const table = DataFrame([Series("name", [value], DataType.Int16)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "year" as const }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
