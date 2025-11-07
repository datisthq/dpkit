import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { copyFile } from "./copy.ts"
import { writeTempFile } from "./temp.ts"

describe("copyFile", () => {
  let testDir: string

  beforeEach(() => {
    testDir = temporaryDirectory()
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

  it("should copy file from source to target", async () => {
    const sourcePath = await writeTempFile("test content")
    const targetPath = path.join(testDir, "target.txt")

    await copyFile({ sourcePath, targetPath })

    const fileExists = await fs
      .stat(targetPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(targetPath, "utf-8")
    expect(content).toBe("test content")
  })

  it("should copy file with exact content", async () => {
    const content = "Hello, World! This is a test file."
    const sourcePath = await writeTempFile(content)
    const targetPath = path.join(testDir, "copy.txt")

    await copyFile({ sourcePath, targetPath })

    const copiedContent = await fs.readFile(targetPath, "utf-8")
    expect(copiedContent).toBe(content)
  })

  it("should copy binary file", async () => {
    const binaryData = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
    const sourcePath = await writeTempFile(binaryData)
    const targetPath = path.join(testDir, "binary.bin")

    await copyFile({ sourcePath, targetPath })

    const copiedData = await fs.readFile(targetPath)
    expect(Buffer.compare(copiedData, binaryData)).toBe(0)
  })

  it("should copy empty file", async () => {
    const sourcePath = await writeTempFile("")
    const targetPath = path.join(testDir, "empty.txt")

    await copyFile({ sourcePath, targetPath })

    const content = await fs.readFile(targetPath, "utf-8")
    expect(content).toBe("")
  })

  it("should copy large file", async () => {
    const largeContent = "x".repeat(100000)
    const sourcePath = await writeTempFile(largeContent)
    const targetPath = path.join(testDir, "large.txt")

    await copyFile({ sourcePath, targetPath })

    const copiedContent = await fs.readFile(targetPath, "utf-8")
    expect(copiedContent).toBe(largeContent)
    expect(copiedContent.length).toBe(100000)
  })

  it("should copy file with special characters", async () => {
    const content = "Special characters: é, ñ, ü, ö, à, 中文, 日本語"
    const sourcePath = await writeTempFile(content)
    const targetPath = path.join(testDir, "special.txt")

    await copyFile({ sourcePath, targetPath })

    const copiedContent = await fs.readFile(targetPath, "utf-8")
    expect(copiedContent).toBe(content)
  })

  it("should copy file to nested directory", async () => {
    const sourcePath = await writeTempFile("nested content")
    const targetPath = path.join(testDir, "nested", "dir", "file.txt")

    await copyFile({ sourcePath, targetPath })

    const fileExists = await fs
      .stat(targetPath)
      .then(() => true)
      .catch(() => false)
    expect(fileExists).toBe(true)

    const content = await fs.readFile(targetPath, "utf-8")
    expect(content).toBe("nested content")
  })

  it("should copy json file", async () => {
    const jsonContent = JSON.stringify({ name: "test", value: 123 })
    const sourcePath = await writeTempFile(jsonContent)
    const targetPath = path.join(testDir, "data.json")

    await copyFile({ sourcePath, targetPath })

    const copiedContent = await fs.readFile(targetPath, "utf-8")
    expect(copiedContent).toBe(jsonContent)
    expect(JSON.parse(copiedContent)).toEqual({ name: "test", value: 123 })
  })

  it("should copy file with newlines", async () => {
    const content = "Line 1\nLine 2\nLine 3\n"
    const sourcePath = await writeTempFile(content)
    const targetPath = path.join(testDir, "multiline.txt")

    await copyFile({ sourcePath, targetPath })

    const copiedContent = await fs.readFile(targetPath, "utf-8")
    expect(copiedContent).toBe(content)
  })
})
