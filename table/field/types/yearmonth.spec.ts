import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseYearmonthField } from "./yearmonth.js"

describe("parseYearmonthField", () => {
  it.each([
    ["2000-01", [2000, 1]],
    ["0-0", [0, 0]],
  ])("%s -> %s", (cell, value) => {
    const field = { name: "name", type: "yearmonth" as const }
    const df = DataFrame({ name: [cell] }).select(parseYearmonthField(field))
    expect(df.toRecords()[0]?.name).toEqual(value)
  })
})
