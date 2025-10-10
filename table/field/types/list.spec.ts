import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable, normalizeTable } from "../../table/index.ts"

describe("parseListField", () => {
  describe("default settings (string items, comma delimiter)", () => {
    it.each([
      // Basic list parsing
      ["a,b,c", ["a", "b", "c"]],
      ["1,2,3", ["1", "2", "3"]],
      ["foo,bar,baz", ["foo", "bar", "baz"]],

      // Empty list
      //["", null],

      // Single item
      ["single", ["single"]],

      // Whitespace handling
      //[" a, b, c ", ["a", "b", "c"]],
      //["\ta,b,c\n", ["a", "b", "c"]],

      // Empty items in list
      ["a,,c", ["a", "", "c"]],
      [",b,", ["", "b", ""]],
      [",,,", ["", "", "", ""]],

      // Null handling
      //[null, null],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [{ name: "name", type: "list" as const }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("integer item type", () => {
    it.each([
      // Valid integers
      ["1,2,3", [1, 2, 3]],
      ["0,-1,42", [0, -1, 42]],
      ["-10,0,10", [-10, 0, 10]],

      // Empty list
      //["", null],

      // Single item
      ["42", [42]],

      // Whitespace handling
      //[" 1, 2, 3 ", [1, 2, 3]],
      //["\t-5,0,5\n", [-5, 0, 5]],

      // Empty items in list (become nulls when converted to integers)
      ["1,,3", [1, null, 3]],
      [",2,", [null, 2, null]],

      // Invalid integers become null
      ["1,a,3", [1, null, 3]],
      ["1.5,2,3", [null, 2, 3]],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "list" as const, itemType: "integer" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("number item type", () => {
    it.each([
      // Valid numbers
      ["1.5,2.1,3.7", [1.5, 2.1, 3.7]],
      ["0,-1.1,42", [0, -1.1, 42]],
      ["-10.5,0,10", [-10.5, 0, 10]],

      // Empty list
      //["", null],

      // Single item
      ["3.14", [3.14]],

      // Whitespace handling
      //[" 1.1, 2.2, 3.3 ", [1.1, 2.2, 3.3]],
      //["\t-5.5,0,5.5\n", [-5.5, 0, 5.5]],

      // Empty items in list (become nulls when converted to numbers)
      ["1.1,,3.3", [1.1, null, 3.3]],
      [",2.2,", [null, 2.2, null]],

      // Invalid numbers become null
      ["1.1,a,3.3", [1.1, null, 3.3]],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "list" as const, itemType: "number" as const },
        ],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })

  describe("custom delimiter", () => {
    it.each([
      // Semicolon delimiter
      ["a;b;c", ["a", "b", "c"]],
      ["1;2;3", ["1", "2", "3"]],

      // Empty list
      //["", null],

      // Single item
      ["single", ["single"]],

      // Whitespace handling
      //[" a; b; c ", ["a", "b", "c"]],

      // Empty items in list
      ["a;;c", ["a", "", "c"]],
    ])("%s -> %s", async (cell, value) => {
      const table = DataFrame([Series("name", [cell], DataType.String)]).lazy()

      const schema = {
        fields: [{ name: "name", type: "list" as const, delimiter: ";" }],
      }

      const ldf = await normalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })
})

describe("stringifyListField", () => {
  describe("default settings (string items, comma delimiter)", () => {
    it.each([
      // Basic list stringifying
      [["a", "b", "c"], "a,b,c"],
      [["foo", "bar", "baz"], "foo,bar,baz"],
      [["1", "2", "3"], "1,2,3"],

      // Single item
      [["single"], "single"],

      // Empty items in list
      [["a", "", "c"], "a,,c"],
      [["", "b", ""], ",b,"],
      [["", "", "", ""], ",,,"],

      // Null handling
      [[null, "b", null], "b"],
      [["a", null, "c"], "a,c"],

      // Empty array
      [[], ""],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.String)),
      ]).lazy()

      const schema = {
        fields: [{ name: "name", type: "list" as const }],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })

  describe("integer item type", () => {
    it.each([
      // Integer lists to string
      [[1, 2, 3], "1,2,3"],
      [[0, -1, 42], "0,-1,42"],
      [[-10, 0, 10], "-10,0,10"],

      // Single item
      [[42], "42"],

      // With nulls (nulls are filtered out)
      [[1, null, 3], "1,3"],
      [[null, 2, null], "2"],

      // Empty array
      [[], ""],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.Int16)),
      ]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "list" as const, itemType: "integer" as const },
        ],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })

  describe("number item type", () => {
    it.each([
      // Number lists to string
      [[1.5, 2.1, 3.7], "1.5,2.1,3.7"],
      [[0, -1.1, 42], "0.0,-1.1,42.0"],
      [[-10.5, 0, 10], "-10.5,0.0,10.0"],

      // Single item
      [[3.14], "3.14"],

      // With nulls
      [[1.1, null, 3.3], "1.1,3.3"],
      [[null, 2.2, null], "2.2"],

      // Empty array
      [[], ""],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.Float64)),
      ]).lazy()

      const schema = {
        fields: [
          { name: "name", type: "list" as const, itemType: "number" as const },
        ],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })

  describe("custom delimiter", () => {
    it.each([
      // Semicolon delimiter
      [["a", "b", "c"], "a;b;c"],
      [["1", "2", "3"], "1;2;3"],

      // Single item
      [["single"], "single"],

      // Empty items in list
      [["a", "", "c"], "a;;c"],
      [["", "b", ""], ";b;"],

      // Numeric items
      [[1.0, 2.0, 3.0], "1.0;2.0;3.0"],

      // Empty array
      [[], ""],
    ])("%s -> %s", async (value, expected) => {
      const table = DataFrame([
        Series("name", [value], DataType.List(DataType.String)),
      ]).lazy()

      const schema = {
        fields: [{ name: "name", type: "list" as const, delimiter: ";" }],
      }

      const ldf = await denormalizeTable(table, schema)
      const df = await ldf.collect()

      expect(df.toRecords()[0]?.name).toEqual(expected)
    })
  })
})
