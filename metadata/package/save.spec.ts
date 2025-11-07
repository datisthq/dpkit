import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import type { Package } from "./Package.ts"
import { savePackageDescriptor } from "./save.ts"

describe("savePackageDescriptor", () => {
  let testDir: string
  let testPath: string
  let testPackage: Package

  beforeEach(() => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "datapackage.json")
    testPackage = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
    }
  })

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch (error) {
      if (error instanceof Error && !error.message.includes("ENOENT")) {
        console.error(`Failed to clean up test directory: ${testDir}`, error)
      }
    }
  })

  it("should save a package descriptor to a file and maintain its structure", async () => {
    await savePackageDescriptor(testPackage, { path: testPath })

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)

    const { $schema, ...packageWithoutSchema } = parsedContent
    expect(packageWithoutSchema.name).toEqual(testPackage.name)
    expect(packageWithoutSchema.resources).toHaveLength(1)
    expect(packageWithoutSchema.resources[0].name).toBe("test-resource")
    expect(packageWithoutSchema.resources[0].path).toBe("data.csv")
    expect($schema).toBe(
      "https://datapackage.org/profiles/2.0/datapackage.json",
    )
  })

  it("should add $schema property if not present", async () => {
    await savePackageDescriptor(testPackage, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.$schema).toBe(
      "https://datapackage.org/profiles/2.0/datapackage.json",
    )
  })

  it("should preserve existing $schema property", async () => {
    const packageWithSchema: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
      $schema: "https://custom.schema.url",
    }

    await savePackageDescriptor(packageWithSchema, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.$schema).toBe("https://custom.schema.url")
  })

  it("should use pretty formatting with 2-space indentation", async () => {
    await savePackageDescriptor(testPackage, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const lines = content.split("\n")
    expect(lines.length).toBeGreaterThan(1)

    if (lines.length > 1 && lines[1]) {
      expect(lines[1].startsWith("  ")).toBe(true)
    }
  })

  it("should save package with multiple resources", async () => {
    const packageWithMultipleResources: Package = {
      name: "test-package",
      resources: [
        {
          name: "resource1",
          path: path.join(testDir, "data1.csv"),
        },
        {
          name: "resource2",
          path: path.join(testDir, "data2.json"),
          format: "json",
        },
      ],
    }

    await savePackageDescriptor(packageWithMultipleResources, {
      path: testPath,
    })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.resources).toHaveLength(2)
    expect(parsedContent.resources[0]?.name).toBe("resource1")
    expect(parsedContent.resources[1]?.name).toBe("resource2")
  })

  it("should save package with resource containing schema", async () => {
    const packageWithSchema: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
          schema: {
            fields: [
              { name: "id", type: "integer" },
              { name: "name", type: "string" },
            ],
          },
        },
      ],
    }

    await savePackageDescriptor(packageWithSchema, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.resources[0]?.schema).toEqual(
      packageWithSchema.resources[0]?.schema,
    )
  })

  it("should save package with resource containing dialect", async () => {
    const packageWithDialect: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
          dialect: {
            delimiter: ";",
            lineTerminator: "\n",
          },
        },
      ],
    }

    await savePackageDescriptor(packageWithDialect, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.resources[0]?.dialect).toEqual(
      packageWithDialect.resources[0]?.dialect,
    )
  })

  it("should save package to a nested directory path", async () => {
    const nestedPath = path.join(testDir, "nested", "dir", "datapackage.json")
    const nestedPackage: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "nested", "dir", "data.csv"),
        },
      ],
    }

    await savePackageDescriptor(nestedPackage, { path: nestedPath })

    const fileExists = await fs
      .stat(nestedPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(nestedPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.name).toBe(nestedPackage.name)
  })

  it("should throw an error when file exists and overwrite is false", async () => {
    await savePackageDescriptor(testPackage, { path: testPath })

    await expect(
      savePackageDescriptor(testPackage, {
        path: testPath,
        overwrite: false,
      }),
    ).rejects.toThrow()
  })

  it("should throw an error when file exists and overwrite is not specified", async () => {
    await savePackageDescriptor(testPackage, { path: testPath })

    await expect(
      savePackageDescriptor(testPackage, { path: testPath }),
    ).rejects.toThrow()
  })

  it("should overwrite existing file when overwrite is true", async () => {
    const initialPackage: Package = {
      name: "initial",
      resources: [
        {
          name: "resource1",
          path: path.join(testDir, "data1.csv"),
        },
      ],
    }

    const updatedPackage: Package = {
      name: "updated",
      resources: [
        {
          name: "resource2",
          path: path.join(testDir, "data2.csv"),
        },
      ],
      description: "Updated package",
    }

    await savePackageDescriptor(initialPackage, { path: testPath })

    const initialContent = await fs.readFile(testPath, "utf-8")
    const initialParsed = JSON.parse(initialContent)
    expect(initialParsed.name).toBe("initial")

    await savePackageDescriptor(updatedPackage, {
      path: testPath,
      overwrite: true,
    })

    const updatedContent = await fs.readFile(testPath, "utf-8")
    const updatedParsed = JSON.parse(updatedContent)
    expect(updatedParsed.name).toBe("updated")
    expect(updatedParsed.description).toBe("Updated package")
  })

  it("should save package with all metadata fields", async () => {
    const fullPackage: Package = {
      name: "full-package",
      title: "Full Package",
      description: "A package with all fields",
      version: "1.0.0",
      homepage: "https://example.com",
      keywords: ["test", "data", "package"],
      created: "2024-01-01T00:00:00Z",
      image: "https://example.com/image.png",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
    }

    await savePackageDescriptor(fullPackage, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.name).toBe(fullPackage.name)
    expect(parsedContent.title).toBe(fullPackage.title)
    expect(parsedContent.description).toBe(fullPackage.description)
    expect(parsedContent.version).toBe(fullPackage.version)
    expect(parsedContent.homepage).toBe(fullPackage.homepage)
    expect(parsedContent.keywords).toEqual(fullPackage.keywords)
    expect(parsedContent.created).toBe(fullPackage.created)
    expect(parsedContent.image).toBe(fullPackage.image)
  })

  it("should save package with contributors", async () => {
    const packageWithContributors: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
      contributors: [
        {
          title: "John Doe",
          email: "john@example.com",
          role: "author",
        },
        {
          title: "Jane Smith",
          path: "https://example.org",
        },
      ],
    }

    await savePackageDescriptor(packageWithContributors, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.contributors).toHaveLength(2)
    expect(parsedContent.contributors[0]?.title).toBe("John Doe")
    expect(parsedContent.contributors[1]?.title).toBe("Jane Smith")
  })

  it("should save package with licenses", async () => {
    const packageWithLicenses: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
      licenses: [
        {
          name: "MIT",
          path: "https://opensource.org/licenses/MIT",
        },
      ],
    }

    await savePackageDescriptor(packageWithLicenses, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.licenses).toHaveLength(1)
    expect(parsedContent.licenses[0]?.name).toBe("MIT")
  })

  it("should save package with sources", async () => {
    const packageWithSources: Package = {
      name: "test-package",
      resources: [
        {
          name: "test-resource",
          path: path.join(testDir, "data.csv"),
        },
      ],
      sources: [
        {
          title: "Example Source",
          path: "https://example.com/data",
        },
      ],
    }

    await savePackageDescriptor(packageWithSources, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.sources).toHaveLength(1)
    expect(parsedContent.sources[0]?.title).toBe("Example Source")
  })
})
