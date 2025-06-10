import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "../../table/index.js"

describe("parseIntegerField", () => {
  it.each([
    // Basic integer parsing
    ["1", 1, {}],
    ["2", 2, {}],
    ["1000", 1000, {}],

    // Empty or invalid values
    ["", null, {}],
    ["2.1", null, {}],
    ["bad", null, {}],
    ["0.0003", null, {}],
    ["3.14", null, {}],
    ["1/2", null, {}],

    // Group character handling
    ["1", 1, { groupChar: "," }],
    ["1,000", 1000, { groupChar: "," }],
    ["1,000,000", 1000000, { groupChar: "," }],
    ["1 000", 1000, { groupChar: " " }],
    ["1'000'000", 1000000, { groupChar: "'" }],
    ["1.000.000", 1000000, { groupChar: "." }],

    // Bare number handling
    ["1", 1, { bareNumber: false }],
    ["1000", 1000, { bareNumber: false }],
    ["$1000", 1000, { bareNumber: false }],
    ["1000$", 1000, { bareNumber: false }],
    ["€1000", 1000, { bareNumber: false }],
    ["1000€", 1000, { bareNumber: false }],
    ["1,000", null, { bareNumber: false }],
    ["-12€", -12, { bareNumber: false }],
    ["€-12", -12, { bareNumber: false }],

    // Leading zeros and whitespace
    ["000835", 835, {}],
    ["0", 0, {}],
    ["00", 0, {}],
    ["01", 1, {}],
    [" 01 ", 1, {}],
    ["  42  ", 42, {}],

    // Combined cases
    ["$1,000,000", 1000000, { bareNumber: false, groupChar: "," }],
    ["1,000,000$", 1000000, { bareNumber: false, groupChar: "," }],
    ["€ 1.000.000", 1000000, { bareNumber: false, groupChar: "." }],
    [" -1,000 ", -1000, { groupChar: "," }],
    ["000,001", 1, { groupChar: "," }],
  ])("$0 -> $1 $2", async (cell, value, options) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "integer" as const, ...options }],
    }

    const ldf = await processTable(table, { schema })
    const df = await ldf.collect()

    expect(df.getColumn("name").get(0)).toEqual(value)
    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})
