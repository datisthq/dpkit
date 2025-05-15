import * as fs from "node:fs/promises"
import * as path from "node:path"
import { temporaryDirectory } from "tempy"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { loadDescriptor } from "./load.js"

describe("loadDescriptor", () => {
  const testSchema = {
    fields: [
      {
        name: "id",
        type: "integer",
      },
      {
        name: "name",
        type: "string",
      },
    ],
  }

  let testDir: string
  let testPath: string

  beforeEach(async () => {
    testDir = temporaryDirectory()
    testPath = path.join(testDir, "schema.json")

    const content = JSON.stringify(testSchema, null, 2)
    await fs.writeFile(testPath, content, "utf-8")
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

  it("loads a descriptor from a local file path", async () => {
    const descriptor = await loadDescriptor({ path: testPath })

    expect(descriptor).toEqual(testSchema)
  })

  it("loads a descriptor from a remote URL", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(testSchema),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const testUrl = "https://example.com/schema.json"
    const descriptor = await loadDescriptor({ path: testUrl })

    expect(global.fetch).toHaveBeenCalledWith(testUrl)
    expect(descriptor).toEqual(testSchema)
  })

  it("throws an error for invalid local path", async () => {
    const invalidPath = path.join(testDir, "nonexistent.json")

    await expect(loadDescriptor({ path: invalidPath })).rejects.toThrow()
  })

  it("throws an error for unsupported protocol", async () => {
    const invalidUrl = "ftp://example.com/schema.json"

    await expect(loadDescriptor({ path: invalidUrl })).rejects.toThrow(
      "Unsupported URL protocol: ftp:",
    )
  })

  it("throws an error for failed remote fetch", async () => {
    const mockResponse = {
      ok: false,
      status: 404,
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const testUrl = "https://example.com/not-found.json"

    await expect(loadDescriptor({ path: testUrl })).rejects.toThrow()
  })

  it("handles JSON parse errors from remote source", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    }

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const testUrl = "https://example.com/invalid.json"

    await expect(loadDescriptor({ path: testUrl })).rejects.toThrow()
  })
})
