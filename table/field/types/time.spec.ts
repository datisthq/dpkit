import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"
import { denormalizeTable } from "../../table/index.ts"

describe("parseTimeField", () => {
  it.each([
    // Default format tests
    ["06:00:00", 6 * 60 * 60 * 10 ** 9, {}],
    // #TODO: Clarify the behavior on the Standard level first
    //["06:00:00Z", 6 * 60 * 60 * 10 ** 9, {}],
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
  ])("$0 -> $1 $2", async (cell, expected, options) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "time" as const, ...options }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
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
    const table = DataFrame([Series("name", [value], DataType.Time)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "time" as const, ...options }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
