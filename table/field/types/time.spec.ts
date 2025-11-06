import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"
import { denormalizeTable } from "../../table/index.ts"

describe("parseTimeField", () => {
  it.each([
    // Default format tests
    ["06:00:00", "06:00:00", {}],
    // #TODO: Clarify the behavior on the Standard level first
    //["06:00:00Z", 6 * 60 * 60 * 10 ** 9, {}],
    ["09:00", null, {}], // Incomplete time
    ["3 am", null, {}], // Wrong format
    ["3.00", null, {}], // Wrong format
    ["invalid", null, {}],
    ["", null, {}],

    // Custom format tests
    ["06:00", "06:00:00", { format: "%H:%M" }],
    ["06:50", null, { format: "%M:%H" }], // Invalid format
    ["3:00 am", "03:00:00", { format: "%H:%M" }],
    ["some night", null, { format: "%H:%M" }],
    ["invalid", null, { format: "%H:%M" }],
    ["", null, { format: "%H:%M" }],

    // Invalid format
    //["06:00", null, { format: "invalid" }],
  ])("$0 -> $1 $2", async (cell, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "time" as const, ...options }],
    }

    const result = await normalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(expected)
  })
})

describe("stringifyTimeField", () => {
  it.each([
    // Default format
    [new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), "06:00:00", {}],
    [new Date(Date.UTC(2014, 0, 1, 16, 30, 0)), "16:30:00", {}],

    // Custom format
    [new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), "06:00", { format: "%H:%M" }],
    [new Date(Date.UTC(2014, 0, 1, 16, 30, 0)), "16:30", { format: "%H:%M" }],
  ])("%s -> %s %o", async (value, expected, options) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.Time)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "time" as const, ...options }],
    }

    const result = await denormalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(expected)
  })
})
