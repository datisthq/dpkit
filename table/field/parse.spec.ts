import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { processTable } from "../table/index.js"

describe("parseField", () => {
  it.each([
    // Missing values
    ["", null, {}],
    ["-", null, { missingValues: ["-"] }],
    ["n/a", null, { missingValues: ["n/a"] }],
  ])("$0 -> $1 $2", async (cell, value, options) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "integer" as const, ...options }],
    }

    const ldf = await processTable(table, { schema })
    const df = await ldf.collect()

    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})
