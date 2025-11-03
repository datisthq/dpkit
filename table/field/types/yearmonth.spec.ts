import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"
import { denormalizeTable } from "../../table/index.ts"

describe("parseYearmonthField", () => {
  it.each([
    ["2000-01", [2000, 1]],
    ["0-0", [0, 0]],
  ])("%s -> %s", async (cell, value) => {
    const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "yearmonth" as const }],
    }

    const result = await normalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(value)
  })
})

describe("stringifyYearmonthField", () => {
  it.each([
    [[2000, 1], "2000-01"],
    [[2023, 12], "2023-12"],
    [[0, 0], "0000-00"],
  ])("%s -> %s", async (value, expected) => {
    const table = pl
      .DataFrame([pl.Series("name", [value], pl.List(pl.Int16))])
      .lazy()

    const schema = {
      fields: [{ name: "name", type: "yearmonth" as const }],
    }

    const result = await denormalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(expected)
  })
})
