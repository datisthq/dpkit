import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseObjectColumn } from "./object.js"

describe("parseObjectColumn", () => {
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
    [' {"name":"John"} ', { name: "John" }],
    ['\t{"name":"John"}\n', { name: "John" }],

    // Invalid JSON
    //["{invalid}", null],
    ["not json", null],
    ["", null],
    ["null", null],
    ["undefined", null],
  ])("%s -> %s", (cell, value) => {
    const field = { name: "name", type: "object" as const }
    const df = DataFrame({ name: [cell] }).select(parseObjectColumn(field))
    const res = df.getColumn("name").get(0)
    expect(res ? JSON.parse(res) : res).toEqual(value)
  })
})
