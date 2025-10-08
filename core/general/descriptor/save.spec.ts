import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { saveDescriptor } from "./save.ts"

describe("saveDescriptor", () => {
  const testDescriptor = {
    name: "test-descriptor",
    version: "1.0.0",
    description: "Test descriptor for save function",
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
    testPath = path.join(testDir, "descriptor.json")
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

  it("should save a descriptor to the specified path", async () => {
    await saveDescriptor(testDescriptor, { path: testPath })

    const fileExists = await fs
      .stat(testPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(testPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent).toEqual(testDescriptor)
  })

  it("should save a descriptor to a nested directory path", async () => {
    const nestedPath = path.join(testDir, "nested", "dir", "descriptor.json")

    await saveDescriptor(testDescriptor, { path: nestedPath })

    const fileExists = await fs
      .stat(nestedPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(nestedPath, "utf-8")
    const parsedContent = JSON.parse(content)
    expect(parsedContent).toEqual(testDescriptor)
  })

  it("should use pretty formatting with 2-space indentation", async () => {
    await saveDescriptor(testDescriptor, { path: testPath })

    const content = await fs.readFile(testPath, "utf-8")
    const expectedFormat = JSON.stringify(testDescriptor, null, 2)
    expect(content).toEqual(expectedFormat)

    const lines = content.split("\n")
    expect(lines.length).toBeGreaterThan(1)

    if (lines.length > 1 && lines[1]) {
      expect(lines[1].startsWith("  ")).toBe(true)
    }
  })

  it("should throw an error when file exists and overwrite is false", async () => {
    await saveDescriptor(testDescriptor, { path: testPath })

    await expect(
      saveDescriptor(testDescriptor, { path: testPath, overwrite: false }),
    ).rejects.toThrow()
  })

  it("should throw an error when file exists and overwrite is not specified", async () => {
    await saveDescriptor(testDescriptor, { path: testPath })

    await expect(
      saveDescriptor(testDescriptor, { path: testPath }),
    ).rejects.toThrow()
  })

  it("should overwrite existing file when overwrite is true", async () => {
    const initialDescriptor = {
      name: "initial",
      version: "1.0.0",
    }

    const updatedDescriptor = {
      name: "updated",
      version: "2.0.0",
      description: "Updated descriptor",
    }

    await saveDescriptor(initialDescriptor, { path: testPath })

    const initialContent = await fs.readFile(testPath, "utf-8")
    const initialParsed = JSON.parse(initialContent)
    expect(initialParsed).toEqual(initialDescriptor)

    await saveDescriptor(updatedDescriptor, {
      path: testPath,
      overwrite: true,
    })

    const updatedContent = await fs.readFile(testPath, "utf-8")
    const updatedParsed = JSON.parse(updatedContent)
    expect(updatedParsed).toEqual(updatedDescriptor)
  })
})
