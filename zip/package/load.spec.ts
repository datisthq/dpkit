import type { Package } from "@dpkit/core"
import { getTempFilePath, writeTempFile } from "@dpkit/file"
import { beforeEach, describe, expect, it } from "vitest"
import { loadPackageFromZip } from "./load.ts"
import { savePackageToZip } from "./save.ts"

describe("loadPackageFromZip", () => {
  let tempZipPath: string

  beforeEach(() => {
    tempZipPath = getTempFilePath()
  })

  it("should load a basic package from zip", async () => {
    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "empty-resource",
          data: [],
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage).toBeDefined()
    expect(loadedPackage.name).toBe("test-package")
    expect(loadedPackage.resources).toHaveLength(1)
  })

  it("should load package with metadata", async () => {
    const originalPackage: Package = {
      name: "test-package",
      title: "Test Package",
      description: "A test data package",
      version: "1.0.0",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage.name).toBe("test-package")
    expect(loadedPackage.title).toBe("Test Package")
    expect(loadedPackage.description).toBe("A test data package")
    expect(loadedPackage.version).toBe("1.0.0")
  })

  it("should load package with inline data resources", async () => {
    const originalPackage: Package = {
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

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage).toBeDefined()
    expect(loadedPackage.resources).toHaveLength(1)
    expect(loadedPackage.resources[0]?.name).toBe("test-resource")
    expect(loadedPackage.resources[0]?.data).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should load package with file resources", async () => {
    const csvContent = "id,name\n1,alice\n2,bob"
    const csvPath = await writeTempFile(csvContent)

    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: csvPath,
          format: "csv",
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage).toBeDefined()
    expect(loadedPackage.resources).toHaveLength(1)
    expect(loadedPackage.resources[0]?.name).toBe("test-resource")
    expect(loadedPackage.resources[0]?.format).toBe("csv")
  })

  it("should load package with schema", async () => {
    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
          schema: {
            fields: [
              { name: "id", type: "integer" },
              { name: "name", type: "string" },
            ],
          },
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage.resources[0]?.schema).toBeDefined()
    const schema = loadedPackage.resources[0]?.schema
    expect(typeof schema === "object" && "fields" in schema).toBe(true)
    if (typeof schema === "object" && "fields" in schema) {
      expect(schema.fields).toHaveLength(2)
    }
  })

  it("should load package with multiple resources", async () => {
    const csvContent = "id,name\n1,alice\n2,bob"
    const csvPath = await writeTempFile(csvContent)

    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          path: csvPath,
          format: "csv",
        },
        {
          name: "resource-2",
          data: [{ id: 1, value: 100 }],
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage).toBeDefined()
    expect(loadedPackage.name).toBe("test-package")
    expect(loadedPackage.resources).toHaveLength(2)
    expect(loadedPackage.resources[0]?.name).toBe("resource-1")
    expect(loadedPackage.resources[1]?.name).toBe("resource-2")
  })

  it("should load package with dialect", async () => {
    const csvContent = "id;name\n1;alice\n2;bob"
    const csvPath = await writeTempFile(csvContent)

    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: csvPath,
          format: "csv",
          dialect: {
            delimiter: ";",
          },
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const loadedPackage = await loadPackageFromZip(tempZipPath)

    expect(loadedPackage.resources[0]?.dialect).toBeDefined()
    const dialect = loadedPackage.resources[0]?.dialect
    expect(typeof dialect === "object" && "delimiter" in dialect).toBe(true)
    if (typeof dialect === "object" && "delimiter" in dialect) {
      expect(dialect.delimiter).toBe(";")
    }
  })

  it("should throw error for non-existent zip file", async () => {
    const nonExistentPath = "/non/existent/path.zip"

    await expect(loadPackageFromZip(nonExistentPath)).rejects.toThrow()
  })

  it("should throw error for invalid zip file", async () => {
    const invalidZipPath = await writeTempFile("not a zip file")

    await expect(loadPackageFromZip(invalidZipPath)).rejects.toThrow()
  })
})
