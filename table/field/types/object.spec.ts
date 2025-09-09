import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

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

describe("stringifyObjectField", () => {
  it.each([
    // JSON strings should be returned as-is
    ['{"name":"John","age":30}', '{"name":"John","age":30}'],
    ['{"numbers":[1,2,3]}', '{"numbers":[1,2,3]}'],
    ['{"nested":{"prop":"value"}}', '{"nested":{"prop":"value"}}'],
    ['{}', "{}"],
    
    // Complex nested objects as JSON strings
    ['{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}', '{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}'],
    ['{"config":{"debug":true,"timeout":5000}}', '{"config":{"debug":true,"timeout":5000}}'],
    
    // Null handling
    [null, null],
  ])("%s -> %s", async (value, expected) => {
    const table = DataFrame({ name: [value] }).lazy()
    const schema = {
      fields: [{ name: "name", type: "object" as const }],
    }

    const ldf = await denormalizeTable(table, schema)
    const df = await ldf.collect()

    expect(df.toRecords()[0]?.name).toEqual(expected)
  })
})
