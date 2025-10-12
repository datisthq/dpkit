import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { loadTable } from "./load.ts"

describe("loadTable", () => {
  it("should load table from CSV file", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table from inline data", async () => {
    const resource = {
      name: "test-resource",
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with schema", async () => {
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

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with custom delimiter", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const resource = {
      path: csvPath,
      format: "csv" as const,
      dialect: { delimiter: "|" },
    }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load denormalized table", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource, { denormalized: true })

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with different data types", async () => {
    const csvPath = await writeTempFile(
      "id,name,score,active\n1,alice,95.5,true\n2,bob,87.3,false",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with empty rows", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
  })

  it("should load table with quoted fields", async () => {
    const csvPath = await writeTempFile(
      'id,name,description\n1,"alice","Test, data"\n2,"bob","Normal"',
    )
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load single row table", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with numeric values", async () => {
    const csvPath = await writeTempFile("id,score\n1,95.5\n2,87.3\n3,100")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with date values", async () => {
    const csvPath = await writeTempFile(
      "id,created\n1,2024-01-01\n2,2024-01-02",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load table with boolean values", async () => {
    const csvPath = await writeTempFile("id,active\n1,true\n2,false\n3,true")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })

  it("should load empty table with headers only", async () => {
    const csvPath = await writeTempFile("id,name,age")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
  })

  it("should load table with null values", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,")
    const resource = { path: csvPath, format: "csv" as const }

    const table = await loadTable(resource)

    expect(table).toBeDefined()
    expect(typeof table).toBe("object")
  })
})
