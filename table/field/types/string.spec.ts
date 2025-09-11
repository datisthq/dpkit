import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

// TODO: Implement proper tests
// TODO: Currently, it fails on to JS conversion from Polars
describe.skip("parseStringField", () => {
  describe("categorical field", () => {
    it.each([["apple", "apple", { categories: ["apple", "banana"] }]])(
      "$0 -> $1 $2",
      async (cell, value, options) => {
        const table = DataFrame([
          Series("name", [cell], DataType.String),
        ]).lazy()

        const schema = {
          fields: [{ name: "name", type: "string" as const, ...options }],
        }

        const ldf = await normalizeTable(table, schema)
        const df = await ldf.collect()

        expect(df.getColumn("name").get(0)).toEqual(value)
      },
    )
  })
})
