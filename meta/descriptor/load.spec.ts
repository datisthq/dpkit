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
    // Arrange
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

    // Act
    const result = await loadDescriptor({ path: fixturePath })

    // Assert
    expect(result).toEqual(expectedContent)
  })

  it("throws error when file system is not supported", async () => {
    // Arrange
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")

    // Mock loadNodeApis to return undefined (simulating browser environment)
    vi.spyOn(nodeModule, "loadNodeApis").mockResolvedValue(undefined)

    // Act & Assert
    await expect(loadDescriptor({ path: fixturePath })).rejects.toThrow(
      "File system is not supported in this environment",
    )
  })

  it("loads a remote descriptor from a URL", async () => {
    // Arrange
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

    // Mock fetch response
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(expectedContent),
    })

    // Act
    const result = await loadDescriptor({ path: testUrl })

    // Assert
    expect(result).toEqual(expectedContent)
    expect(fetch).toHaveBeenCalledWith(testUrl)
  })

  it("throws error for unsupported URL protocol", async () => {
    // Arrange
    const testUrl = "file:///path/to/schema.json"

    // Act & Assert
    await expect(loadDescriptor({ path: testUrl })).rejects.toThrow(
      "Unsupported URL protocol: file:",
    )
  })

  it("throws error when remoteOnly is true but path is local", async () => {
    // Arrange
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")

    // Act & Assert
    await expect(
      loadDescriptor({ path: fixturePath, remoteOnly: true }),
    ).rejects.toThrow("Local descriptors are forbidden")
  })
})
