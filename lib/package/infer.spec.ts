import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { inferPackage } from "./infer.ts"

describe("inferPackage", () => {
  it("should infer package with single resource", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const dataPackage = {
      name: "test-package",
      resources: [{ path: csvPath, format: "csv" as const }],
    }

    const result = await inferPackage(dataPackage)

    expect(result.name).toBe("test-package")
    expect(result.resources).toBeDefined()
    expect(result.resources.length).toBe(1)
    expect(result.resources?.[0]?.schema).toBeDefined()
  })

  it("should infer package with multiple resources", async () => {
    const csv1Path = await writeTempFile("id,name\n1,alice\n2,bob")
    const csv2Path = await writeTempFile("id,value\n1,100\n2,200")
    const dataPackage = {
      name: "test-package",
      resources: [
        { path: csv1Path, format: "csv" as const },
        { path: csv2Path, format: "csv" as const },
      ],
    }

    const result = await inferPackage(dataPackage)

    expect(result.name).toBe("test-package")
    expect(result.resources.length).toBe(2)
    expect(result.resources?.[0]?.schema).toBeDefined()
    expect(result.resources?.[1]?.schema).toBeDefined()
  })

  it("should preserve package-level properties", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const dataPackage = {
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      version: "1.0.0",
      resources: [{ path: csvPath, format: "csv" as const }],
    }

    const result = await inferPackage(dataPackage)

    expect(result.name).toBe("test-package")
    expect(result.title).toBe("Test Package")
    expect(result.description).toBe("A test package")
    expect(result.version).toBe("1.0.0")
  })

  it("should pass options to resource inference", async () => {
    const csvPath = await writeTempFile("id|name\n1|alice\n2|bob")
    const dataPackage = {
      name: "test-package",
      resources: [{ path: csvPath, format: "csv" as const }],
    }

    const result = await inferPackage(dataPackage, { delimiter: "|" })

    expect(result.resources?.[0]?.dialect).toBeDefined()
    expect(result.resources?.[0]?.schema).toBeDefined()
  })

  it("should handle empty resources array", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [],
    }

    const result = await inferPackage(dataPackage)

    expect(result.name).toBe("test-package")
    expect(result.resources).toEqual([])
  })

  it("should preserve existing resource properties", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          path: csvPath,
          format: "csv" as const,
          name: "custom-name",
          title: "Custom Resource",
        },
      ],
    }

    const result = await inferPackage(dataPackage)

    expect(result.resources?.[0]?.name).toBe("custom-name")
    expect(result.resources?.[0]?.title).toBe("Custom Resource")
  })

  it("should infer package with inline data resources", async () => {
    const dataPackage = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [
            { id: 1, name: "alice" },
            { id: 2, name: "bob" },
          ],
        },
      ],
    }

    const result = await inferPackage(dataPackage)

    expect(result.name).toBe("test-package")
    expect(result.resources.length).toBe(1)
    expect(result.resources?.[0]?.name).toBe("test-resource")
    expect(result.resources?.[0]?.data).toBeDefined()
  })

  it("should handle mixed file and inline resources", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const dataPackage = {
      name: "test-package",
      resources: [
        { path: csvPath, format: "csv" as const },
        {
          name: "inline-resource",
          data: [{ id: 1, value: 100 }],
        },
      ],
    }

    const result = await inferPackage(dataPackage)

    expect(result.resources.length).toBe(2)
    expect(result.resources?.[0]?.path).toBe(csvPath)
    expect(result.resources?.[1]?.data).toBeDefined()
  })
})
