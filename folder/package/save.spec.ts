import { access, readFile } from "node:fs/promises"
import { join } from "node:path"
import { getTempFilePath, writeTempFile } from "@dpkit/dataset"
import type { Package } from "@dpkit/metadata"
import { beforeEach, describe, expect, it } from "vitest"
import { loadPackageFromFolder } from "./load.ts"
import { savePackageToFolder } from "./save.ts"

describe("savePackageToFolder", () => {
  let tempFolderPath: string

  beforeEach(() => {
    tempFolderPath = getTempFilePath()
  })

  it("should save a basic package to folder", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    await expect(access(descriptorPath)).resolves.toBeUndefined()
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

    await savePackageToFolder(originalPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

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

    await savePackageToFolder(originalPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

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

    await savePackageToFolder(originalPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

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

    await savePackageToFolder(originalPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

    expect(reloadedPackage.resources).toHaveLength(1)
    expect(reloadedPackage.resources[0]?.name).toBe("test-resource")
    expect(reloadedPackage.resources[0]?.format).toBe("csv")
  })

  it("should throw error when saving to existing folder", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [],
        },
      ],
    }

    const fs = await import("node:fs/promises")
    await fs.mkdir(tempFolderPath, { recursive: true })
    await fs.writeFile(join(tempFolderPath, "existing.txt"), "content")

    await expect(
      savePackageToFolder(dataPackage, { folderPath: tempFolderPath }),
    ).rejects.toThrow()
  })

  it("should create valid folder structure", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    }

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

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

    await savePackageToFolder(originalPackage, { folderPath: tempFolderPath })
    const reloadedPackage = await loadPackageFromFolder(tempFolderPath)

    expect(reloadedPackage.resources).toHaveLength(2)
    expect(reloadedPackage.resources[0]?.name).toBe("resource-1")
    expect(reloadedPackage.resources[1]?.name).toBe("resource-2")
  })

  it("should create datapackage.json in folder", async () => {
    const dataPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    }

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    const descriptorContent = await readFile(descriptorPath, "utf-8")
    const descriptor = JSON.parse(descriptorContent)

    expect(descriptor.name).toBe("test-package")
    expect(descriptor.resources).toHaveLength(1)
  })

  it("should copy file resources to folder", async () => {
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

    await savePackageToFolder(dataPackage, { folderPath: tempFolderPath })

    const descriptorPath = join(tempFolderPath, "datapackage.json")
    const descriptorContent = await readFile(descriptorPath, "utf-8")
    const descriptor = JSON.parse(descriptorContent)

    const resourcePath = descriptor.resources[0].path
    const resourceFilePath = join(tempFolderPath, resourcePath)
    const resourceContent = await readFile(resourceFilePath, "utf-8")

    expect(resourceContent).toBe(csvContent)
  })
})
