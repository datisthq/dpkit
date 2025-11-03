import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"
import { denormalizeTable } from "../../table/index.ts"

// TODO: Enable this test suite after this issue is fixed:
// https://github.com/pola-rs/nodejs-polars/issues/365
describe.skip("parseDatetimeField", () => {
  it.each([
    // Default format
    ["2014-01-01T06:00:00", new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), {}],
    ["2014-01-01T06:00:00Z", new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), {}],
    ["Mon 1st Jan 2014 9 am", null, {}],
    ["invalid", null, {}],
    ["", null, {}],

    // Custom formats
    [
      "21/11/2006 16:30",
      new Date(2006, 10, 21, 16, 30),
      { format: "%d/%m/%Y %H:%M" },
    ],
    ["16:30 21/11/06", null, { format: "%H:%M %d/%m/%y" }], // Incorrect format
    ["invalid", null, { format: "%d/%m/%y %H:%M" }],
    ["", null, { format: "%d/%m/%y %H:%M" }],

    // Invalid format
    ["21/11/06 16:30", null, { format: "invalid" }],
  ])("%s -> %s %o", async (cell, expected, options) => {
    const table = pl
      .DataFrame([pl.Series("name", [cell], pl.DataType.String)])
      .lazy()

    const schema = {
      fields: [{ name: "name", type: "datetime" as const, ...options }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})

describe("stringifyDatetimeField", () => {
  it.each([
    // Default format
    [new Date(Date.UTC(2014, 0, 1, 6, 0, 0)), "2014-01-01T06:00:00", {}],
    [new Date(Date.UTC(2006, 10, 21, 16, 30, 0)), "2006-11-21T16:30:00", {}],

    // Custom format
    [
      new Date(Date.UTC(2006, 10, 21, 16, 30, 0)),
      "21/11/2006 16:30",
      { format: "%d/%m/%Y %H:%M" },
    ],
    [
      new Date(Date.UTC(2014, 0, 1, 6, 0, 0)),
      "2014/01/01T06:00:00",
      { format: "%Y/%m/%dT%H:%M:%S" },
    ],
  ])("%s -> %s %o", async (value, expected, options) => {
    const table = pl
      .DataFrame([pl.Series("name", [value], pl.DataType.Datetime)])
      .lazy()

    const schema = {
      fields: [{ name: "name", type: "datetime" as const, ...options }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
