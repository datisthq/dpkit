import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { inferDialect } from "./infer.ts"

// TODO: fix this test/implementation
describe.skip("inferDialect", () => {
  it("should infer dialect from CSV file with comma delimiter", async () => {
    const csvPath = await writeTempFile("id,name,age\n1,alice,25\n2,bob,30")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toEqual({ delimiter: "|" })
  })

  it("should infer dialect from CSV file with pipe delimiter", async () => {
    const csvPath = await writeTempFile("id|name|age\n1|alice|25\n2|bob|30")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toEqual({ delimiter: "|" })
  })

  it("should infer dialect from CSV file with semicolon delimiter", async () => {
    const csvPath = await writeTempFile("id;name;age\n1;alice;25\n2;bob;30")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toEqual({ delimiter: ";" })
  })

  it("should infer dialect from CSV file with tab delimiter", async () => {
    const csvPath = await writeTempFile(
      "id\tname\tage\n1\talice\t25\n2\tbob\t30",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource, { delimiter: "\t" })

    expect(dialect).toBeDefined()
  })

  it("should handle CSV with quoted fields", async () => {
    const csvPath = await writeTempFile(
      'id,name,description\n1,"alice","Description with, comma"\n2,"bob","Normal text"',
    )
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
  })

  it("should handle CSV with different quote character", async () => {
    const csvPath = await writeTempFile(
      "id,name,description\n1,'alice','Description text'\n2,'bob','Normal text'",
    )
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
  })

  it("should handle resources without path", async () => {
    const resource = {
      name: "test-resource",
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
  })

  it("should return empty object for non-CSV resources", async () => {
    const resource = {
      name: "test-resource",
      format: "json" as const,
      data: [{ id: 1 }],
    }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
    expect(typeof dialect).toBe("object")
  })

  it("should handle CSV with custom line terminator", async () => {
    const csvPath = await writeTempFile("id,name\r\n1,alice\r\n2,bob\r\n")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
  })

  it("should handle CSV with header row only", async () => {
    const csvPath = await writeTempFile("id,name,age")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
  })

  it("should handle empty CSV file", async () => {
    const csvPath = await writeTempFile("")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource)

    expect(dialect).toBeDefined()
    expect(typeof dialect).toBe("object")
  })

  it("should respect provided delimiter option", async () => {
    const csvPath = await writeTempFile("id|name|age\n1|alice|25\n2|bob|30")
    const resource = { path: csvPath, format: "csv" as const }

    const dialect = await inferDialect(resource, { delimiter: "|" })

    expect(dialect).toBeDefined()
  })
})
