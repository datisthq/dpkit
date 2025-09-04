import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

describe("parseDurationField", () => {
  it.each([["P23DT23H", "P23DT23H", {}]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const table = DataFrame({ name: [cell] }).lazy()
      const schema = {
        fields: [{ name: "name", type: "duration" as const, ...options }],
      }

      const ldf = await normalizeTable(table, { schema })
      const df = await ldf.collect()

      expect(df.getColumn("name").get(0)).toEqual(value)
    },
  )
})
