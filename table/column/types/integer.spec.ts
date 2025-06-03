import { DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseIntegerColumn } from "./integer.js"

describe("parseIntegerColumn", () => {
  it.each([
    ["1", 1, {}],
    ["2", 2, {}],
    ["1000", 1000, {}],

    ["", null, {}],
    ["2.1", null, {}],
    ["bad", null, {}],

    ["1", 1, { groupChar: "," }],
    ["1,000", 1000, { groupChar: "," }],

    ["1", 1, { bareNumber: false }],
    ["1000", 1000, { bareNumber: false }],
    ["$1000", 1000, { bareNumber: false }],
    ["1,000", null, { bareNumber: false }],
  ])("$0 -> $1 $2", async (cell, value, options) => {
    const column = Series("name", [cell], DataType.Utf8)
    const field = { name: "name", type: "integer", ...options }

    // @ts-ignore
    expect(parseIntegerColumn({ column, field }).toArray()).toEqual([value])
  })
})
