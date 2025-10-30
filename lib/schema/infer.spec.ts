import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { inferSchema } from "./infer.ts"

describe("inferSchema", () => {
  it("should infer schema from CSV file", async () => {
    const csvPath = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(3)
    expect(schema?.fields?.[0]?.name).toBe("id")
    expect(schema?.fields?.[1]?.name).toBe("name")
    expect(schema?.fields?.[2]?.name).toBe("age")
  })

  it("should infer field types correctly", async () => {
    const csvPath = await writeTempFile(
      "id,name,score\n1,alice,95.5\n2,bob,87.3",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema?.fields?.[0]?.type).toBe("integer")
    expect(schema?.fields?.[1]?.type).toBe("string")
    expect(schema?.fields?.[2]?.type).toBe("number")
  })

  it("should infer schema from inline data", async () => {
    const resource = {
      name: "test-resource",
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(2)
    expect(schema?.fields?.[0]?.name).toBe("id")
    expect(schema?.fields?.[1]?.name).toBe("name")
  })

  it("should infer schema with custom delimiter", async () => {
    const csvPath = await writeTempFile("id|name|value\n1|alice|100\n2|bob|200")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: "|" },
    }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(3)
    expect(schema?.fields?.[0]?.name).toBe("id")
    expect(schema?.fields?.[1]?.name).toBe("name")
    expect(schema?.fields?.[2]?.name).toBe("value")
  })

  it("should handle boolean fields", async () => {
    const csvPath = await writeTempFile("id,active\n1,true\n2,false")
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema?.fields?.[1]?.type).toBe("boolean")
  })

  it("should handle date fields", async () => {
    const csvPath = await writeTempFile(
      "id,created\n1,2024-01-01\n2,2024-01-02",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema?.fields?.[1]?.type).toBe("date")
  })

  it("should handle mixed numeric types", async () => {
    const csvPath = await writeTempFile("id,value\n1,100\n2,200.5")
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema?.fields?.[1]?.type).toBe("string")
  })

  it("should infer schema from single row", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice")
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(2)
  })

  it("should handle empty string values", async () => {
    const csvPath = await writeTempFile(
      "id,name,email\n1,alice,\n2,bob,bob@example.com",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields?.length).toBe(3)
    expect(schema?.fields?.[2]?.name).toBe("email")
  })

  it("should infer schema with sampleRows option", async () => {
    const csvPath = await writeTempFile(
      "id,name\n1,alice\n2,bob\n3,charlie\n4,david\n5,eve",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource, { sampleRows: 2 })

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(2)
  })

  it("should handle resources with headers only", async () => {
    const csvPath = await writeTempFile("id,name,age")
    const resource = { path: csvPath, format: "csv" as const }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields).toBeDefined()
    expect(schema?.fields?.length).toBe(3)
  })

  it("should infer schema from complex inline data", async () => {
    const resource = {
      name: "test-resource",
      data: [
        {
          id: 1,
          name: "alice",
          score: 95.5,
          active: true,
          created: "2024-01-01",
        },
        {
          id: 2,
          name: "bob",
          score: 87.3,
          active: false,
          created: "2024-01-02",
        },
      ],
    }

    const schema = await inferSchema(resource)

    expect(schema).toBeDefined()
    expect(schema?.fields?.length).toBe(5)
    expect(schema?.fields?.find(f => f.name === "id")?.type).toBe("integer")
    expect(schema?.fields?.find(f => f.name === "name")?.type).toBe("string")
    expect(schema?.fields?.find(f => f.name === "score")?.type).toBe("number")
    expect(schema?.fields?.find(f => f.name === "active")?.type).toBe("boolean")
    expect(schema?.fields?.find(f => f.name === "created")?.type).toBe("date")
  })
})
