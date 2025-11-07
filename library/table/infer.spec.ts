import { writeTempFile } from "@dpkit/dataset"
import { describe, expect, it } from "vitest"
import { inferTable } from "./infer.ts"

describe("inferTable", () => {
  it("should infer table with dialect and schema from CSV", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should use provided dialect when available", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: "|" },
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.dialect.delimiter).toBe("|")
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should use provided schema when available", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
        ],
      },
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.schema.fields).toHaveLength(2)
    expect(result?.table).toBeDefined()
  })

  it("should infer table with custom delimiter", async () => {
    const csvPath = await writeTempFile("id;name;age\n1;alice;25\n2;bob;30")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: ";" },
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.dialect.delimiter).toBe(";")
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table from inline data", async () => {
    const resource = {
      name: "test-resource",
      type: "table" as const,
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer schema with various data types", async () => {
    const csvPath = await writeTempFile(
      "id,name,score,active\n1,alice,95.5,true\n2,bob,87.3,false",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.schema.fields).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with numeric columns", async () => {
    const csvPath = await writeTempFile("id,score\n1,95.5\n2,87.3\n3,100")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.schema.fields).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with date columns", async () => {
    const csvPath = await writeTempFile(
      "id,created\n1,2024-01-01\n2,2024-01-02",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with boolean columns", async () => {
    const csvPath = await writeTempFile("id,active\n1,true\n2,false\n3,true")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should handle table with quoted fields", async () => {
    const csvPath = await writeTempFile(
      'id,name,description\n1,"alice","Test, data"\n2,"bob","Normal"',
    )
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with single row", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with empty values", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })

  it("should infer table with headers only", async () => {
    const csvPath = await writeTempFile("id,name,age")
    const resource = { path: csvPath, format: "csv" as const }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
  })

  it("should use both provided dialect and schema", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: "|" },
      schema: {
        fields: [
          { name: "id", type: "integer" as const },
          { name: "name", type: "string" as const },
        ],
      },
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.dialect.delimiter).toBe("|")
    expect(result?.schema).toBeDefined()
    expect(result?.schema.fields).toHaveLength(2)
    expect(result?.table).toBeDefined()
  })

  it("should infer table with tab delimiter", async () => {
    const csvPath = await writeTempFile("id\tname\n1\talice\n2\tbob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: "\t" },
    }

    const result = await inferTable(resource)

    expect(result).toBeDefined()
    expect(result?.dialect).toBeDefined()
    expect(result?.schema).toBeDefined()
    expect(result?.table).toBeDefined()
  })
})
