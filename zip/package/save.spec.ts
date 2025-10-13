import { readFile } from "node:fs/promises"
import type { Package } from "@dpkit/core"
import { getTempFilePath, writeTempFile } from "@dpkit/file"
import { beforeEach, describe, expect, it } from "vitest"
import { loadPackageFromZip } from "./load.ts"
import { savePackageToZip } from "./save.ts"

describe("savePackageToZip", () => {
  let tempZipPath: string

  beforeEach(() => {
    tempZipPath = getTempFilePath()
  })

  it("should save a basic package to zip", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with metadata", async () => {
    const dataPackage: Package = {
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      version: "1.0.0",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with inline data resources", async () => {
    const dataPackage: Package = {
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

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with file resources", async () => {
    const csvContent = "id,name\n1,alice\n2,bob"
    const csvPath = await writeTempFile(csvContent)

    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: csvPath,
          format: "csv",
        },
      ],
    }

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with multiple resources", async () => {
    const csvContent = "id,name\n1,alice\n2,bob"
    const csvPath = await writeTempFile(csvContent)

    const dataPackage: Package = {
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

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with schema", async () => {
    const dataPackage: Package = {
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

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save package with dialect", async () => {
    const csvContent = "id;name\n1;alice\n2;bob"
    const csvPath = await writeTempFile(csvContent)

    const dataPackage: Package = {
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

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })

    const fileBuffer = await readFile(tempZipPath)
    expect(fileBuffer.length).toBeGreaterThan(0)
  })

  it("should save and reload package with same structure", async () => {
    const originalPackage: Package = {
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    expect(reloadedPackage).toBeDefined()
    expect(reloadedPackage.name).toBe("test-package")
    expect(reloadedPackage.title).toBe("Test Package")
    expect(reloadedPackage.description).toBe("A test package")
    expect(reloadedPackage.resources).toHaveLength(1)
    expect(reloadedPackage.resources[0]?.name).toBe("test-resource")
  })

  it("should save and reload package preserving metadata", async () => {
    const originalPackage: Package = {
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      version: "1.0.0",
      keywords: ["test", "package"],
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    expect(reloadedPackage.name).toBe("test-package")
    expect(reloadedPackage.title).toBe("Test Package")
    expect(reloadedPackage.version).toBe("1.0.0")
    expect(reloadedPackage.keywords).toEqual(["test", "package"])
  })

  it("should save and reload package with schema", async () => {
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
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    const schema = reloadedPackage.resources[0]?.schema
    expect(schema).toBeDefined()
    expect(typeof schema === "object" && "fields" in schema).toBe(true)
    if (typeof schema === "object" && "fields" in schema) {
      expect(schema.fields).toHaveLength(2)
      expect(schema.fields?.[0]?.name).toBe("id")
      expect(schema.fields?.[1]?.name).toBe("name")
    }
  })

  it("should save and reload package with file resources", async () => {
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
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    expect(reloadedPackage.resources).toHaveLength(1)
    expect(reloadedPackage.resources[0]?.name).toBe("test-resource")
    expect(reloadedPackage.resources[0]?.format).toBe("csv")
  })

  it("should throw error when saving to existing file", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    await writeTempFile("existing content", { persist: true })
    const existingPath = await writeTempFile("existing content")

    await expect(
      savePackageToZip(dataPackage, { archivePath: existingPath }),
    ).rejects.toThrow()
  })

  it("should create valid zip file structure", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    }

    await savePackageToZip(dataPackage, { archivePath: tempZipPath })
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    expect(reloadedPackage).toMatchObject({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
        },
      ],
    })
  })

  it("should save package with multiple file resources", async () => {
    const csv1Content = "id,name\n1,alice"
    const csv2Content = "id,value\n1,100"
    const csv1Path = await writeTempFile(csv1Content)
    const csv2Path = await writeTempFile(csv2Content)

    const originalPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          path: csv1Path,
          format: "csv",
        },
        {
          name: "resource-2",
          path: csv2Path,
          format: "csv",
        },
      ],
    }

    await savePackageToZip(originalPackage, { archivePath: tempZipPath })
    const reloadedPackage = await loadPackageFromZip(tempZipPath)

    expect(reloadedPackage.resources).toHaveLength(2)
    expect(reloadedPackage.resources[0]?.name).toBe("resource-1")
    expect(reloadedPackage.resources[1]?.name).toBe("resource-2")
  })
})
