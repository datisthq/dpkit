import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "../../table/index.ts"

// TODO: Enable this test suite
// Currently, it seems to have a weird datetime translation bug on the Polars side
// as resutls within the dataframe are correct, but exported ones are not
describe.skip("parseDatetimeField", () => {
  it.each([
    // Default format
    ["2014-01-01T06:00:00", new Date(2014, 0, 1, 6, 0, 0), {}],
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
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "datetime" as const, ...options }],
    }

    const ldf = await processTable(table, { schema })
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
