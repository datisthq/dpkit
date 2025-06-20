import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "../../table/index.js"

describe("parseNumberField", () => {
  it.each([
    // Basic number parsing
    ["1", 1.0, {}],
    ["2", 2.0, {}],
    ["1000", 1000.0, {}],
    ["1.5", 1.5, {}],
    // biome-ignore lint/suspicious: tests
    ["3.14159", 3.14159, {}],
    ["-42", -42.0, {}],
    ["-3.14", -3.14, {}],

    // Empty or invalid values
    ["", null, {}],
    ["bad", null, {}],
    ["text", null, {}],

    // Group character handling
    ["1", 1.0, { groupChar: "," }],
    ["1,000", 1000.0, { groupChar: "," }],
    ["1,000,000", 1000000.0, { groupChar: "," }],
    ["1 000", 1000.0, { groupChar: " " }],
    ["1#000#000", 1000000.0, { groupChar: "#" }],

    // Decimal character handling
    ["1.5", 1.5, { decimalChar: "." }],
    ["1,5", 1.5, { decimalChar: "," }],
    ["3,14", 3.14, { decimalChar: "," }],
    ["3.14", 3.14, { decimalChar: "." }],

    // Bare number handling
    ["1.5", 1.5, { bareNumber: true }],
    ["$1.5", null, { bareNumber: true }],
    ["1.5%", null, { bareNumber: true }],
    ["$1.5", 1.5, { bareNumber: false }],
    ["1.5%", 1.5, { bareNumber: false }],
    ["$1,000.00", null, { bareNumber: true }],
    ["$1,000.00", 1000.0, { bareNumber: false, groupChar: "," }],
    [
      "€ 1.000,00",
      1000.0,
      { bareNumber: false, groupChar: ".", decimalChar: "," },
    ],
    [
      "1.000,00 €",
      1000.0,
      { bareNumber: false, groupChar: ".", decimalChar: "," },
    ],

    // Complex cases with multiple options
    ["1,234.56", 1234.56, { groupChar: "," }],
    ["1.234,56", 1234.56, { groupChar: ".", decimalChar: "," }],
    ["$1,234.56", null, { bareNumber: true, groupChar: "," }],
    ["$1,234.56", 1234.56, { bareNumber: false, groupChar: "," }],
    ["1,234.56$", 1234.56, { bareNumber: false, groupChar: "," }],
    [
      "1.234,56 €",
      1234.56,
      { bareNumber: false, groupChar: ".", decimalChar: "," },
    ],
  ])("$0 -> $1 $2", async (cell, value, options) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "number" as const, ...options }],
    }

    const ldf = await processTable(table, { schema })
    const df = await ldf.collect()

    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})
