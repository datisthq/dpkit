import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseYearColumn } from "./year.js"

describe("parseYearColumn", () => {
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
    [" 2023 ", 2023],
    ["  1984  ", 1984],
    ["bad", null],
    ["12345", null],
    ["123", null],
  ])("%s -> %s", (cell, value) => {
    const field = { name: "name", type: "year" as const }
    const df = DataFrame({ name: [cell] }).select(parseYearColumn(field))
    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})
