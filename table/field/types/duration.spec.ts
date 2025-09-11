import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

describe("parseDurationField", () => {
  it.each([["P23DT23H", "P23DT23H", {}]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()
      const schema = {
        fields: [{ name: "name", type: "duration" as const, ...options }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.getColumn("name").get(0)).toEqual(value)
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
    const table = DataFrame([Series("name", [value], DataType.String)]).lazy()

    const schema = {
      fields: [{ name: "name", type: "duration" as const }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
