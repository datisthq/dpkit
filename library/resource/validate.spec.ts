import { describe, expect, it } from "vitest"
import { validateResource } from "./validate.ts"

describe("validateResource", () => {
  it("should catch validation errors for invalid tabular data", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { id: 1, name: "Alice", active: true },
        { id: 2, name: "Bob", active: 123 },
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
          { name: "active", type: "boolean" as const },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toEqual(1)
  })

  it("should validate correct tabular data", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { name: "Alice", active: true },
        { name: "Bob", active: false },
      ],
      schema: {
        fields: [
          { name: "name", type: "string" as const },
          { name: "active", type: "boolean" as const },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should catch multiple validation errors", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        { id: 1, name: "Alice", age: 25 },
        { id: "not-a-number", name: "Bob", age: "not-a-number" },
        { id: 3, name: "Charlie", age: -5 },
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
          {
            name: "age",
            type: "integer" as const,
            constraints: { minimum: 0 },
          },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors.length).toEqual(3)
  })

  it("should catch missing table error when schema is defined but table cannot be loaded", async () => {
    const resource = {
      name: "test",
      path: "table.bad",
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
        ],
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "data",
        message: "missing test table",
      },
    ])
  })

  it("should validate document with jsonSchema", async () => {
    const resource = {
      name: "test-document",
      data: {
        name: "test-package",
        version: "1.0.0",
        author: {
          name: "John Doe",
          email: "john@example.com",
        },
      },
      jsonSchema: {
        type: "object",
        required: ["name", "version", "author"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
          author: {
            type: "object",
            required: ["name", "email"],
            properties: {
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should catch validation errors for document with invalid jsonSchema data", async () => {
    const resource = {
      name: "test-document",
      data: {
        name: "test-package",
        version: 123,
      },
      jsonSchema: {
        type: "object",
        required: ["name", "version"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
        },
      },
    }

    const report = await validateResource(resource)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "document/json",
        pointer: "/version",
        message: "must be string",
      },
    ])
  })
})
