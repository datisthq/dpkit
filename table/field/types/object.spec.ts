import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../../table/index.ts"

describe("parseObjectField", () => {
  it.each([
    // Valid JSON objects
    ['{"name":"John","age":30}', { name: "John", age: 30 }],
    ['{"numbers":[1,2,3]}', { numbers: [1, 2, 3] }],
    ['{"nested":{"prop":"value"}}', { nested: { prop: "value" } }],
    ["{}", {}],

    // JSON but not an object
    ["[1,2,3]", null],
    ['["a","b","c"]', null],

    // Trimming whitespace
    //[' {"name":"John"} ', { name: "John" }],
    //['\t{"name":"John"}\n', { name: "John" }],

    // Invalid JSON
    //["{invalid}", null],
    ["not json", null],
    ["", null],
    ["null", null],
    ["undefined", null],
  ])("%s -> %s", async (cell, value) => {
    const table = DataFrame({ name: [cell] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "object" as const }],
    }

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()

    const res = df.getColumn("name").get(0)
    expect(res ? JSON.parse(res) : res).toEqual(value)
  })
})
