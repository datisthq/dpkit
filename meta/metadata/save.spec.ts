import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { saveMetadata } from "./save.js"

describe("saveMetadata", () => {
  const testMetadata = {
    name: "test-metadata",
    version: "1.0.0",
    description: "Test metadata for save function",
    resources: [
      {
        name: "resource1",
        path: "data/resource1.csv",
      },
    ],
  }

  let testDir: string
  let testPath: string

  beforeEach(() => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "metadata.json")
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

  it("should save a metadata to the specified path", async () => {
    const result = await saveMetadata({
      metadata: testMetadata,
      path: testPath,
    })

    expect(result).toBe(true)

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent).toEqual(testMetadata)
  })

  it("should save a metadata to a nested directory path", async () => {
    const nestedPath = path.join(testDir, "nested", "dir", "metadata.json")

    const result = await saveMetadata({
      metadata: testMetadata,
      path: nestedPath,
    })

    expect(result).toBe(true)

    const fileExists = await fs
      .stat(nestedPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(nestedPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent).toEqual(testMetadata)
  })

  it("should use pretty formatting with 2-space indentation", async () => {
    await saveMetadata({
      metadata: testMetadata,
      path: testPath,
    })

    const content = await fs.readFile(testPath, "utf-8")
    const expectedFormat = JSON.stringify(testMetadata, null, 2)
    expect(content).toEqual(expectedFormat)

    const lines = content.split("\n")
    expect(lines.length).toBeGreaterThan(1)

    if (lines.length > 1 && lines[1]) {
      expect(lines[1].startsWith("  ")).toBe(true)
    }
  })
})
