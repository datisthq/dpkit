import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import type { Resource } from "./Resource.ts"
import { saveResourceDescriptor } from "./save.ts"

describe("saveResourceDescriptor", () => {
  let testDir: string
  let testPath: string
  let testResource: Resource

  beforeEach(() => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "resource.json")
    testResource = {
      name: "test-resource",
      path: path.join(testDir, "data.csv"),
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

  it("should save a resource descriptor to a file and maintain its structure", async () => {
    await saveResourceDescriptor(testResource, { path: testPath })

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)

    const { $schema, ...resourceWithoutSchema } = parsedContent
    expect(resourceWithoutSchema.name).toEqual(testResource.name)
    expect(resourceWithoutSchema.path).toBe("data.csv")
    expect($schema).toBe(
      "https://datapackage.org/profiles/2.0/dataresource.json",
    )
  })

  it("should add $schema property if not present", async () => {
    await saveResourceDescriptor(testResource, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.$schema).toBe(
      "https://datapackage.org/profiles/2.0/dataresource.json",
    )
  })

  it("should preserve existing $schema property", async () => {
    const resourceWithSchema: Resource = {
      name: "test-resource",
      path: path.join(testDir, "data.csv"),
      $schema: "https://custom.schema.url",
    }

    await saveResourceDescriptor(resourceWithSchema, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.$schema).toBe("https://custom.schema.url")
  })

  it("should use pretty formatting with 2-space indentation", async () => {
    await saveResourceDescriptor(testResource, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const lines = content.split("\n")
    expect(lines.length).toBeGreaterThan(1)

    if (lines.length > 1 && lines[1]) {
      expect(lines[1].startsWith("  ")).toBe(true)
    }
  })

  it("should save resource with schema", async () => {
    const resourceWithSchema: Resource = {
      name: "test-resource",
      path: path.join(testDir, "data.csv"),
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
    }

    await saveResourceDescriptor(resourceWithSchema, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.schema).toEqual(resourceWithSchema.schema)
  })

  it("should save resource with dialect", async () => {
    const resourceWithDialect: Resource = {
      name: "test-resource",
      path: path.join(testDir, "data.csv"),
      dialect: {
        delimiter: ";",
        lineTerminator: "\n",
      },
    }

    await saveResourceDescriptor(resourceWithDialect, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.dialect).toEqual(resourceWithDialect.dialect)
  })

  it("should save resource to a nested directory path", async () => {
    const nestedPath = path.join(testDir, "nested", "dir", "resource.json")
    const nestedResource: Resource = {
      name: "test-resource",
      path: path.join(testDir, "nested", "dir", "data.csv"),
    }

    await saveResourceDescriptor(nestedResource, { path: nestedPath })

    const fileExists = await fs
      .stat(nestedPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(nestedPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.name).toBe(nestedResource.name)
  })

  it("should throw an error when file exists and overwrite is false", async () => {
    await saveResourceDescriptor(testResource, { path: testPath })

    await expect(
      saveResourceDescriptor(testResource, {
        path: testPath,
        overwrite: false,
      }),
    ).rejects.toThrow()
  })

  it("should throw an error when file exists and overwrite is not specified", async () => {
    await saveResourceDescriptor(testResource, { path: testPath })

    await expect(
      saveResourceDescriptor(testResource, { path: testPath }),
    ).rejects.toThrow()
  })

  it("should overwrite existing file when overwrite is true", async () => {
    const initialResource: Resource = {
      name: "initial",
      path: path.join(testDir, "data1.csv"),
    }

    const updatedResource: Resource = {
      name: "updated",
      path: path.join(testDir, "data2.csv"),
      description: "Updated resource",
    }

    await saveResourceDescriptor(initialResource, { path: testPath })

    const initialContent = await fs.readFile(testPath, "utf-8")
    const initialParsed = JSON.parse(initialContent)
    expect(initialParsed.name).toBe("initial")

    await saveResourceDescriptor(updatedResource, {
      path: testPath,
      overwrite: true,
    })

    const updatedContent = await fs.readFile(testPath, "utf-8")
    const updatedParsed = JSON.parse(updatedContent)
    expect(updatedParsed.name).toBe("updated")
    expect(updatedParsed.description).toBe("Updated resource")
  })

  it("should save resource with all metadata fields", async () => {
    const fullResource: Resource = {
      name: "full-resource",
      path: path.join(testDir, "data.csv"),
      title: "Full Resource",
      description: "A resource with all fields",
      format: "csv",
      mediatype: "text/csv",
      encoding: "utf-8",
      bytes: 1024,
      hash: "abc123",
    }

    await saveResourceDescriptor(fullResource, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent.name).toBe(fullResource.name)
    expect(parsedContent.title).toBe(fullResource.title)
    expect(parsedContent.description).toBe(fullResource.description)
    expect(parsedContent.format).toBe(fullResource.format)
    expect(parsedContent.bytes).toBe(fullResource.bytes)
  })
})
