import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseTimeField } from "./time.js"

describe("parseTimeField", () => {
  it.each([
    // Default format tests
    ["06:00:00", 6 * 60 * 60 * 10 ** 9, {}],
    ["06:00:00Z", 6 * 60 * 60 * 10 ** 9, {}],
    ["09:00", null, {}], // Incomplete time
    ["3 am", null, {}], // Wrong format
    ["3.00", null, {}], // Wrong format
    ["invalid", null, {}],
    ["", null, {}],

    // Custom format tests
    ["06:00", 6 * 60 * 60 * 10 ** 9, { format: "%H:%M" }],
    ["06:50", null, { format: "%M:%H" }], // Invalid format
    ["3:00 am", null, { format: "%H:%M" }], // Not matching the format
    ["some night", null, { format: "%H:%M" }],
    ["invalid", null, { format: "%H:%M" }],
    ["", null, { format: "%H:%M" }],

    // Invalid format
    //["06:00", null, { format: "invalid" }],
  ])("$0 -> $1 $2", (cell, expected, options) => {
    const field = { name: "name", type: "time" as const, ...options }
    const df = DataFrame({ name: [cell] }).select(parseTimeField(field))
    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
