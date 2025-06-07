import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseListField } from "./list.js"

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
    ])("%s -> %s", (cell, value) => {
      const field = { name: "name", type: "list" as const }
      const df = DataFrame({ name: [cell] }).select(parseListField(field))
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
    ])("%s -> %s", (cell, value) => {
      const field = {
        name: "name",
        type: "list" as const,
        itemType: "integer" as const,
      }
      const df = DataFrame({ name: [cell] }).select(parseListField(field))
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
    ])("%s -> %s", (cell, value) => {
      const field = {
        name: "name",
        type: "list" as const,
        itemType: "number" as const,
      }
      const df = DataFrame({ name: [cell] }).select(parseListField(field))
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
    ])("%s -> %s", (cell, value) => {
      const field = { name: "name", type: "list" as const, delimiter: ";" }
      const df = DataFrame({ name: [cell] }).select(parseListField(field))
      expect(df.toRecords()[0]?.name).toEqual(value)
    })
  })
})
