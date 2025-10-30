import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (object field)", () => {
  it("should not report errors for valid JSON objects", async () => {
    const table = DataFrame({
      metadata: ['{"key":"value"}', '{"num":123}', '{"arr":[1,2,3]}'],
    }).lazy()

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
    const table = DataFrame({
      data: ['[1,2,3]', '{"key":"value"}', '["a","b","c"]'],
    }).lazy()

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
    const table = DataFrame({
      config: ['{"key":"value"}', null, '{"num":123}'],
    }).lazy()

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
    const table = DataFrame({
      data: ['{"valid":true}', 'invalid json', '{"key":"value"}', '{broken}'],
    }).lazy()

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
    const table = DataFrame({
      complex: [
        '{"user":{"name":"John","age":30,"tags":["admin","user"]}}',
        '{"nested":{"deep":{"value":true}}}',
        '{"array":[{"id":1},{"id":2}]}',
      ],
    }).lazy()

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
    const table = DataFrame({
      data: ['{"valid":true}', "", '{"key":"value"}'],
    }).lazy()

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
    const table = DataFrame({
      data: ['"string"', "123", "true", "false", "null"],
    }).lazy()

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
})
