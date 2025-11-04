import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { inspectTable } from "../../table/index.ts"

describe("validateArrayField", () => {
  it("should not errors for valid JSON arrays", async () => {
    const table = pl
      .DataFrame({
        tags: ['["tag1","tag2"]', "[1,2,3]", '["a","b","c"]'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "tags",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for empty arrays", async () => {
    const table = pl
      .DataFrame({
        items: ["[]", "[]", "[]"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "items",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should not errors for null values", async () => {
    const table = pl
      .DataFrame({
        data: ['["value"]', null, "[1,2,3]"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should errors for JSON objects", async () => {
    const table = pl
      .DataFrame({
        data: ["[1,2,3]", '{"key":"value"}', '["a","b"]'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 2,
        cell: '{"key":"value"}',
      },
    ])
  })

  it("should errors for invalid JSON", async () => {
    const table = pl
      .DataFrame({
        data: ['["valid"]', "invalid json", "[1,2,3]", "[broken"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/type")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "array",
      rowNumber: 2,
      cell: "invalid json",
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "array",
      rowNumber: 4,
      cell: "[broken",
    })
  })

  it("should handle nested arrays", async () => {
    const table = pl
      .DataFrame({
        matrix: ["[[1,2],[3,4]]", "[[5,6],[7,8]]", '[["a","b"],["c","d"]]'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "matrix",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should errors for empty strings", async () => {
    const table = pl
      .DataFrame({
        data: ['["valid"]', "", "[1,2,3]"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 2,
        cell: "",
      },
    ])
  })

  it("should errors for JSON primitives", async () => {
    const table = pl
      .DataFrame({
        data: ['"string"', "123", "true", "false", "null"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "array",
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 1,
        cell: '"string"',
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 2,
        cell: "123",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 3,
        cell: "true",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 4,
        cell: "false",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "array",
        rowNumber: 5,
        cell: "null",
      },
    ])
  })

  it("should not errors for arrays matching jsonSchema", async () => {
    const table = pl
      .DataFrame({
        scores: ["[80,90,100]", "[75,85,95]", "[90,95,100]"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "scores",
          type: "array",
          constraints: {
            jsonSchema: {
              type: "array",
              items: { type: "number" },
              minItems: 3,
              maxItems: 3,
            },
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should errors for arrays not matching jsonSchema", async () => {
    const jsonSchema = {
      type: "array",
      items: { type: "number" },
      minItems: 2,
    }

    const table = pl
      .DataFrame({
        numbers: ["[1,2,3]", '["not","numbers"]', "[1]", "[4,5,6]"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "numbers",
          type: "array",
          constraints: {
            jsonSchema,
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/jsonSchema")).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "numbers",
        rowNumber: 2,
        cell: '["not","numbers"]',
        pointer: "/0",
        message: "must be number",
      },
      {
        type: "cell/jsonSchema",
        fieldName: "numbers",
        rowNumber: 2,
        cell: '["not","numbers"]',
        pointer: "/1",
        message: "must be number",
      },
      {
        type: "cell/jsonSchema",
        fieldName: "numbers",
        rowNumber: 3,
        cell: "[1]",
        pointer: "",
        message: "must NOT have fewer than 2 items",
      },
    ])
  })

  it("should validate complex jsonSchema with array of objects", async () => {
    const table = pl
      .DataFrame({
        users: [
          '[{"name":"John","age":30},{"name":"Jane","age":25}]',
          '[{"name":"Bob","age":"invalid"}]',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "users",
          type: "array",
          constraints: {
            jsonSchema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age: { type: "number" },
                },
                required: ["name", "age"],
              },
            },
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "users",
        rowNumber: 2,
        cell: '[{"name":"Bob","age":"invalid"}]',
        pointer: "/0/age",
        message: "must be number",
      },
    ])
  })

  it("should validate jsonSchema with unique items constraint", async () => {
    const table = pl
      .DataFrame({
        tags: ['["unique","values"]', '["duplicate","duplicate"]'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "tags",
          type: "array",
          constraints: {
            jsonSchema: {
              type: "array",
              items: { type: "string" },
              uniqueItems: true,
            },
          },
        },
      ],
    }

    const errors = await inspectTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "tags",
        rowNumber: 2,
        cell: '["duplicate","duplicate"]',
        pointer: "",
        message:
          "must NOT have duplicate items (items ## 1 and 0 are identical)",
      },
    ])
  })
})
