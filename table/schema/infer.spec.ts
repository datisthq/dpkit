import { DataFrame, Series } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inferSchema } from "./infer.js"

describe("inferSchema", () => {
  it.each([
    {
      description: "should infer from native types",
      table: DataFrame({
        // TODO: support inferring integers from floats?
        integer: Series("integer", [1, 2], DataType.Int32),
        number: [1.1, 2.2],
      }).lazy(),
      schema: {
        fields: [
          { name: "integer", type: "integer" },
          { name: "number", type: "number" },
        ],
      },
    },
    {
      description: "should infer integers",
      table: DataFrame({
        name: ["1", "2", "3"],
      }).lazy(),
      schema: {
        fields: [{ name: "name", type: "integer" }],
      },
    },
  ])("$description", async ({ table, schema }) => {
    expect(await inferSchema({ table })).toEqual(schema)
  })
})
