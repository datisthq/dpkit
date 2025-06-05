import { DataFrame, Series } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inferSchema } from "./infer.js"

describe("inferSchema", () => {
  it("should infer from native types", async () => {
    const table = DataFrame({
      // TODO: support inferring integers from floats?
      integer: Series("integer", [1, 2], DataType.Int32),
      number: [1.1, 2.2],
    }).lazy()

    const schema = {
      fields: [
        { name: "integer", type: "integer" },
        { name: "number", type: "number" },
      ],
    }

    expect(await inferSchema({ table })).toEqual(schema)
  })

  it("should infer numeric", async () => {
    const table = DataFrame({
      name1: ["1", "2", "3"],
      name2: ["1,1", "2,2", "3,3"],
      name3: ["1.1", "2.2", "3.3"],
      name4: ["1,000.1", "2,000.2", "3,000.3"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer" },
        { name: "name2", type: "integer", groupChar: "," },
        { name: "name3", type: "number" },
        { name: "name4", type: "number", groupChar: "," },
      ],
    }

    expect(await inferSchema({ table })).toEqual(schema)
  })

  it("should infer numeric (commaDecimal)", async () => {
    const table = DataFrame({
      name1: ["1.1", "2.2", "3.3"],
      name2: ["1.1,0", "2.2,0", "3.3,0"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "integer", groupChar: "." },
        { name: "name2", type: "number", decimalChar: ",", groupChar: "." },
      ],
    }

    expect(await inferSchema({ table, commaDecimal: true })).toEqual(schema)
  })

  it("should infer booleans", async () => {
    const table = DataFrame({
      name1: ["true", "True", "TRUE"],
      name2: ["false", "False", "FALSE"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "boolean" },
        { name: "name2", type: "boolean" },
      ],
    }

    expect(await inferSchema({ table })).toEqual(schema)
  })

  it("should infer objects", async () => {
    const table = DataFrame({
      name1: ['{"a": 1}'],
      name2: ["{}"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "object" },
        { name: "name2", type: "object" },
      ],
    }

    expect(await inferSchema({ table })).toEqual(schema)
  })

  it("should infer arrays", async () => {
    const table = DataFrame({
      name1: ["[1,2,3]"],
      name2: ["[]"],
    }).lazy()

    const schema = {
      fields: [
        { name: "name1", type: "array" },
        { name: "name2", type: "array" },
      ],
    }

    expect(await inferSchema({ table })).toEqual(schema)
  })
})
