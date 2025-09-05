import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

describe("parseYearmonthField", () => {
  it.each([
    ["2000-01", [2000, 1]],
    ["0-0", [0, 0]],
  ])("%s -> %s", async (cell, value) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "yearmonth" as const }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(value)
  })
})
