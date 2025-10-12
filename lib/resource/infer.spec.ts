import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { inferResource } from "./infer.ts"

describe("inferResource", () => {
  it("should infer name from path", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.name).toBeDefined()
    expect(typeof result.name).toBe("string")
  })

  it("should infer bytes (file size)", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.bytes).toBeGreaterThan(0)
  })

  it("should infer hash", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.hash).toBeDefined()
    expect(typeof result.hash).toBe("string")
    expect(result.hash?.length).toBeGreaterThan(0)
  })

  it("should infer dialect for CSV files", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.dialect).toBeDefined()
  })

  it("should infer schema for tabular data", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.schema).toBeDefined()
    expect(
      typeof result.schema === "object" &&
        "fields" in result.schema &&
        result.schema.fields,
    ).toBeDefined()
    expect(
      typeof result.schema === "object" &&
        "fields" in result.schema &&
        result.schema.fields?.length,
    ).toBeGreaterThan(0)
  })

  it("should set type to table when schema is inferred", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource)

    expect(result.type).toBe("table")
  })

  it("should preserve existing properties", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      name: "custom-name",
      title: "Custom Title",
      description: "Custom description",
    }

    const result = await inferResource(resource)

    expect(result.name).toBe("custom-name")
    expect(result.title).toBe("Custom Title")
    expect(result.description).toBe("Custom description")
  })

  it("should not override existing format", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "json" as const,
    }

    const result = await inferResource(resource)

    expect(result.format).toBe("json")
  })

  it("should handle inline data without path", async () => {
    const resource = {
      name: "test-resource",
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const result = await inferResource(resource)

    expect(result.name).toBe("test-resource")
    expect(result.data).toEqual(resource.data)
    expect(result.bytes).toBeUndefined()
    expect(result.hash).toBeUndefined()
  })

  it("should infer dialect with custom options", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource, { delimiter: "|" })

    expect(result.dialect).toBeDefined()
  })

  it("should infer schema with custom delimiter", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferResource(resource, { delimiter: "|" })

    expect(result.schema).toBeDefined()
    expect(
      typeof result.schema === "object" &&
        "fields" in result.schema &&
        result.schema.fields,
    ).toBeDefined()
    expect(
      typeof result.schema === "object" &&
        "fields" in result.schema &&
        result.schema.fields?.length,
    ).toBe(2)
  })

  it("should not override existing encoding", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      encoding: "iso-8859-1",
    }

    const result = await inferResource(resource)

    expect(result.encoding).toBe("iso-8859-1")
  })

  it("should not override existing bytes", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      bytes: 12345,
    }

    const result = await inferResource(resource)

    expect(result.bytes).toBe(12345)
  })

  it("should not override existing hash", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      hash: "custom-hash",
    }

    const result = await inferResource(resource)

    expect(result.hash).toBe("custom-hash")
  })

  it("should not override existing dialect", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: ";" },
    }

    const result = await inferResource(resource)

    expect(
      typeof result.dialect === "object" &&
        "delimiter" in result.dialect &&
        result.dialect.delimiter,
    ).toBe(";")
  })

  it("should not override existing schema", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const customSchema = {
      fields: [
        { name: "custom1", type: "string" as const },
        { name: "custom2", type: "string" as const },
      ],
    }
    const resource = {
      path: csvPath,
      format: "csv" as const,
      schema: customSchema,
    }

    const result = await inferResource(resource)

    expect(result.schema).toEqual(customSchema)
  })
})
