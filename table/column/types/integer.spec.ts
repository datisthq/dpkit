import { DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseIntegerColumn } from "./integer.js"

describe("parseIntegerColumn", () => {
  it.each([
    {
      description: "general",
      cells: ["1", "2", "3", "3.1", "bad", ""],
      values: [1, 2, 3, null, null, null],
    },
    {
      description: "groupChar (,)",
      groupChar: ",",
      cells: ["1", "1,000", "1.000"],
      values: [1, 1000, null],
    },
    {
      description: "bareNumber (false)",
      bareNumber: false,
      cells: ["1", "1000", "$1000", "1,000"],
      values: [1, 1000, 1000, null],
    },
  ])("$description", async ({ cells, values, ...rest }) => {
    const column = Series("name", cells, DataType.Utf8)
    const field = { name: "name", type: "integer", ...rest }

    // @ts-ignore
    expect(parseIntegerColumn({ column, field }).toArray()).toEqual(values)
  })
})
