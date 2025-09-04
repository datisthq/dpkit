import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

describe("parseDateField", () => {
  it.each([
    // Default format
    ["2019-01-01", new Date(Date.UTC(2019, 0, 1)), {}],
    ["10th Jan 1969", null, {}],
    ["invalid", null, {}],
    ["", null, {}],

    // Custom format
    ["21/11/2006", new Date(Date.UTC(2006, 10, 21)), { format: "%d/%m/%Y" }],
    ["21/11/06 16:30", null, { format: "%d/%m/%y" }],
    ["invalid", null, { format: "%d/%m/%y" }],
    ["", null, { format: "%d/%m/%y" }],
    ["2006/11/21", new Date(Date.UTC(2006, 10, 21)), { format: "%Y/%m/%d" }],

    // Invalid format
    ["21/11/06", null, { format: "invalid" }],
  ])("%s -> %s %o", async (cell, expected, options) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "date" as const, ...options }],
    }

    const ldf = await normalizeTable(table, { schema })
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
