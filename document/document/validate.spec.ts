import { describe, expect, it } from "vitest"
import { validateDocument } from "./validate.ts"

describe("validateDocument", () => {
  it("should return valid report when data matches jsonSchema", async () => {
    const resource = {
      name: "test-document",
      data: {
        name: "test-package",
        version: "1.0.0",
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

    const report = await validateDocument(resource)

    expect(report.valid).toBe(true)
    expect(report.errors).toEqual([])
  })

  it("should return error when data is missing with jsonSchema", async () => {
    const resource = {
      name: "test-document",
      jsonSchema: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
        },
      },
    }

    const report = await validateDocument(resource)

    expect(report.valid).toBe(false)
    expect(report.errors).toEqual([
      {
        type: "data",
        message: "missing test-document data",
      },
    ])
  })

  it("should return validation errors when data does not match jsonSchema", async () => {
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

    const report = await validateDocument(resource)

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
