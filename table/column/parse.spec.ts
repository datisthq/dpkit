import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseColumn } from "./parse.js"

describe("parseColumn", () => {
  it.each([
    // Missing values
    ["", null, {}],
    ["-", null, { missingValues: ["-"] }],
    ["n/a", null, { missingValues: ["n/a"] }],
  ])("$0 -> $1 $2", async (cell, value, options) => {
    const field = { name: "name", type: "integer" as const, ...options }
    const df = DataFrame({ name: [cell] }).select(parseColumn({ field }))
    expect(df.getColumn("name").get(0)).toEqual(value)
  })
})
