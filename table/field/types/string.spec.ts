import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseStringField } from "./string.js"

// TODO: Implement proper tests
// TODO: Currently, it fails on to JS conversion from Polars
describe.skip("parseStringField", () => {
  it.each([["apple", "apple", { categories: ["apple", "banana"] }]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const field = { name: "name", type: "string" as const, ...options }
      const df = DataFrame({ name: [cell] }).select(parseStringField(field))
      expect(df.getColumn("name").get(0)).toEqual(value)
    },
  )
})
