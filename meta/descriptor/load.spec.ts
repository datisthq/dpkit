import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { loadDescriptor } from "./load.js"
import * as nodeModule from "./node.js"

describe("loadDescriptor", () => {
  // Setup mocks for fetch
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks()
  })

  afterEach(() => {
    // Restore original fetch after each test
    globalThis.fetch = originalFetch
  })

  it("loads a local descriptor from a file path", async () => {
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")
    const expectedContent = {
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

    const result = await loadDescriptor({ path: fixturePath })

    expect(result).toEqual(expectedContent)
  })

  it("throws error when file system is not supported", async () => {
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")

    vi.spyOn(nodeModule, "loadNodeApis").mockResolvedValue(undefined)

    await expect(loadDescriptor({ path: fixturePath })).rejects.toThrow(
      "File system is not supported in this environment",
    )
  })

  it("loads a remote descriptor from a URL", async () => {
    const testUrl = "https://example.com/schema.json"
    const expectedContent = {
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

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(expectedContent),
    })

    const result = await loadDescriptor({ path: testUrl })

    expect(result).toEqual(expectedContent)
    expect(fetch).toHaveBeenCalledWith(testUrl)
  })

  it("throws error for unsupported URL protocol", async () => {
    const testUrl = "file:///path/to/schema.json"

    await expect(loadDescriptor({ path: testUrl })).rejects.toThrow(
      "Unsupported remote protocol: file:",
    )
  })

  it("throws error when secure is true but path is local", async () => {
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")

    await expect(
      loadDescriptor({ path: fixturePath, secure: true }),
    ).rejects.toThrow("Cannot load descriptor for security reasons")
  })
})
