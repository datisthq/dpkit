import { access } from "node:fs/promises"
import { join } from "node:path"
import { writeTempFile } from "@dpkit/dataset"
import { getTempFolderPath } from "@dpkit/folder"
import { describe, expect, it } from "vitest"
import { loadPackage } from "./load.ts"
import { savePackage } from "./save.ts"

describe("savePackage", () => {
  it("should save package to datapackage.json file", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)
    const dataPackage = await loadPackage(packagePath)
    const tempDir = getTempFolderPath()
    const targetPath = join(tempDir, "datapackage.json")

    await savePackage(dataPackage, {
      target: targetPath,
    })

    expect(
      await access(targetPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
  })

  it("should save package with multiple resources", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      resources: [
        {
          name: "resource-1",
          data: [{ id: 1, name: "alice" }],
        },
        {
          name: "resource-2",
          data: [{ id: 2, value: 100 }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)
    const dataPackage = await loadPackage(packagePath)
    const tempDir = getTempFolderPath()
    const targetPath = join(tempDir, "datapackage.json")

    await savePackage(dataPackage, {
      target: targetPath,
    })

    expect(
      await access(targetPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
  })

  it("should save and reload package with same structure", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      title: "Test Package",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1, name: "alice" }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)
    const originalPackage = await loadPackage(packagePath)
    const tempDir = getTempFolderPath()
    const targetPath = join(tempDir, "datapackage.json")

    await savePackage(originalPackage, { target: targetPath })
    const reloadedPackage = await loadPackage(targetPath)

    expect(reloadedPackage).toBeDefined()
    expect(reloadedPackage.name).toBe("test-package")
    expect(reloadedPackage.title).toBe("Test Package")
  })

  it("should save package with metadata", async () => {
    const packageContent = JSON.stringify({
      name: "test-package",
      title: "Test Package",
      description: "A test package",
      version: "1.0.0",
      resources: [
        {
          name: "test-resource",
          data: [{ id: 1 }],
        },
      ],
    })
    const packagePath = await writeTempFile(packageContent)
    const dataPackage = await loadPackage(packagePath)
    const tempDir = getTempFolderPath()
    const targetPath = join(tempDir, "datapackage.json")

    await savePackage(dataPackage, {
      target: targetPath,
    })

    expect(
      await access(targetPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
  })

  it("should save package with schema", async () => {
    const packageContent = JSON.stringify({
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
    })
    const packagePath = await writeTempFile(packageContent)
    const dataPackage = await loadPackage(packagePath)
    const tempDir = getTempFolderPath()
    const targetPath = join(tempDir, "datapackage.json")

    await savePackage(dataPackage, {
      target: targetPath,
    })

    expect(
      await access(targetPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
  })
})
