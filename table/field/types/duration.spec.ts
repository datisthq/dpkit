import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "../../table/index.js"

describe("parseDurationField", () => {
  it.each([["P23DT23H", "P23DT23H", {}]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const table = DataFrame({ name: [cell] }).lazy()
      const schema = {
        fields: [{ name: "name", type: "duration" as const, ...options }],
      }

      const ldf = await processTable(table, { schema })
      const df = await ldf.collect()

      expect(df.getColumn("name").get(0)).toEqual(value)
    },
  )
})
