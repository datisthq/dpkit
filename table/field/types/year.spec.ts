import * as pl from "nodejs-polars"
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
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "year" as const }],
    }

    const result = await normalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.getColumn("name").get(0)).toEqual(value)
  })
})

describe("stringifyYearField", () => {
  it.each([
    // Basic integer years to string conversion
    [2000, "2000"],
    [2023, "2023"],
    [1999, "1999"],
    [0, "0000"],
    [9999, "9999"],

    // Edge cases with null values
    [null, ""],
  ])("%s -> %s", async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.Int16)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "year" as const }],
    }

    const result = await denormalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(expected)
  })
})
