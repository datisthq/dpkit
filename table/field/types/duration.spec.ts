import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

describe("parseDurationField", () => {
  it.each([["P23DT23H", "P23DT23H", {}]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const table = pl.DataFrame([pl.Series("name", [cell], pl.String)]).lazy()
      const schema = {
        fields: [{ name: "name", type: "duration" as const, ...options }],
      }

      const result = await normalizeTable(table, schema)
      const frame = await result.collect()

      expect(frame.getColumn("name").get(0)).toEqual(value)
    },
  )
})

describe("stringifyDurationField", () => {
  it.each([
    // ISO 8601 duration strings should be returned as-is
    ["P23DT23H", "P23DT23H"],
    ["P1Y2M3DT4H5M6S", "P1Y2M3DT4H5M6S"],
    ["PT30M", "PT30M"],
    ["P1D", "P1D"],
    ["PT1H", "PT1H"],
    ["P1W", "P1W"],
    ["PT0S", "PT0S"],

    // Null handling
    [null, ""],
  ])("%s -> %s", async (value, expected) => {
    const table = pl.DataFrame([pl.Series("name", [value], pl.String)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "duration" as const }],
    }

    const result = await denormalizeTable(table, schema)
    const frame = await result.collect()

    expect(frame.toRecords()[0]?.name).toEqual(expected)
  })
})
