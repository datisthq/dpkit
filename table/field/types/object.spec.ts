import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateObjectField", () => {
  it("should not report errors for valid JSON objects", async () => {
    const table = pl
      .DataFrame({
        metadata: ['{"key":"value"}', '{"num":123}', '{"arr":[1,2,3]}'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "metadata",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for JSON arrays", async () => {
    const table = pl
      .DataFrame({
        data: ["[1,2,3]", '{"key":"value"}', '["a","b","c"]'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 1,
        cell: "[1,2,3]",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 3,
        cell: '["a","b","c"]',
      },
    ])
  })

  it("should not report errors for null values", async () => {
    const table = pl
      .DataFrame({
        config: ['{"key":"value"}', null, '{"num":123}'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "config",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for invalid JSON", async () => {
    const table = pl
      .DataFrame({
        data: ['{"valid":true}', "invalid json", '{"key":"value"}', "{broken}"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/type")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "object",
      rowNumber: 2,
      cell: "invalid json",
    })
    expect(errors).toContainEqual({
      type: "cell/type",
      fieldName: "data",
      fieldType: "object",
      rowNumber: 4,
      cell: "{broken}",
    })
  })

  it("should handle complex nested JSON structures", async () => {
    const table = pl
      .DataFrame({
        complex: [
          '{"user":{"name":"John","age":30,"tags":["admin","user"]}}',
          '{"nested":{"deep":{"value":true}}}',
          '{"array":[{"id":1},{"id":2}]}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "complex",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for empty strings", async () => {
    const table = pl
      .DataFrame({
        data: ['{"valid":true}', "", '{"key":"value"}'],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 2,
        cell: "",
      },
    ])
  })

  it("should report errors for JSON primitives", async () => {
    const table = pl
      .DataFrame({
        data: ['"string"', "123", "true", "false", "null"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "object",
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 1,
        cell: '"string"',
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 2,
        cell: "123",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 3,
        cell: "true",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 4,
        cell: "false",
      },
      {
        type: "cell/type",
        fieldName: "data",
        fieldType: "object",
        rowNumber: 5,
        cell: "null",
      },
    ])
  })

  it("should not report errors for objects matching jsonSchema", async () => {
    const table = pl
      .DataFrame({
        user: [
          '{"name":"John","age":30}',
          '{"name":"Jane","age":25}',
          '{"name":"Bob","age":35}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "user",
          type: "object",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                name: { type: "string" },
                age: { type: "number" },
              },
              required: ["name", "age"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report errors for objects not matching jsonSchema", async () => {
    const jsonSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["name", "age"],
    }

    const table = pl
      .DataFrame({
        user: [
          '{"name":"John","age":30}',
          '{"name":"Jane"}',
          '{"age":25}',
          '{"name":"Bob","age":"invalid"}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "user",
          type: "object",
          constraints: {
            jsonSchema,
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/jsonSchema")).toHaveLength(3)
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "user",
      jsonSchema,
      rowNumber: 2,
      cell: '{"name":"Jane"}',
    })
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "user",
      jsonSchema,
      rowNumber: 3,
      cell: '{"age":25}',
    })
    expect(errors).toContainEqual({
      type: "cell/jsonSchema",
      fieldName: "user",
      jsonSchema,
      rowNumber: 4,
      cell: '{"name":"Bob","age":"invalid"}',
    })
  })

  it("should validate complex jsonSchema with nested objects", async () => {
    const table = pl
      .DataFrame({
        config: [
          '{"database":{"host":"localhost","port":5432},"cache":{"enabled":true}}',
          '{"database":{"host":"localhost","port":"invalid"},"cache":{"enabled":true}}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "config",
          type: "object",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                database: {
                  type: "object",
                  properties: {
                    host: { type: "string" },
                    port: { type: "number" },
                  },
                  required: ["host", "port"],
                },
                cache: {
                  type: "object",
                  properties: {
                    enabled: { type: "boolean" },
                  },
                  required: ["enabled"],
                },
              },
              required: ["database", "cache"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "config",
        jsonSchema: schema.fields[0].constraints?.jsonSchema,
        rowNumber: 2,
        cell: '{"database":{"host":"localhost","port":"invalid"},"cache":{"enabled":true}}',
      },
    ])
  })

  it("should validate jsonSchema with array properties", async () => {
    const table = pl
      .DataFrame({
        data: [
          '{"items":[1,2,3],"name":"test"}',
          '{"items":["not","numbers"],"name":"test"}',
        ],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        {
          name: "data",
          type: "object",
          constraints: {
            jsonSchema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: { type: "number" },
                },
                name: { type: "string" },
              },
              required: ["items", "name"],
            },
          },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toEqual([
      {
        type: "cell/jsonSchema",
        fieldName: "data",
        jsonSchema: schema.fields[0].constraints?.jsonSchema,
        rowNumber: 2,
        cell: '{"items":["not","numbers"],"name":"test"}',
      },
    ])
  })
})
