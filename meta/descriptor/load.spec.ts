import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { loadDescriptor } from "./load.js"
import * as nodeModule from "./node.js"

describe("loadDescriptor", () => {
  const fixtureDir = path.join(import.meta.dirname, "fixtures")
  const getFixturePath = (name: string) => path.join(fixtureDir, name)
  const expectedDescriptor = {
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

  const originalFetch = globalThis.fetch
  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.resetAllMocks()
  })

  it("loads a local descriptor from a file path", async () => {
    const { basepath, descriptor } = await loadDescriptor({
      path: getFixturePath("schema.json"),
    })

    expect(basepath).toEqual(fixtureDir)
    expect(descriptor).toEqual(expectedDescriptor)
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

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(expectedDescriptor),
    })

    const { basepath, descriptor } = await loadDescriptor({ path: testUrl })

    expect(basepath).toEqual("https://example.com")
    expect(descriptor).toEqual(expectedDescriptor)
    expect(fetch).toHaveBeenCalledWith(testUrl)
  })

  it("throws error for unsupported URL protocol", async () => {
    const testUrl = "file:///path/to/schema.json"

    await expect(loadDescriptor({ path: testUrl })).rejects.toThrow(
      "Unsupported remote protocol: file:",
    )
  })

  it("throws error when onlyRemote is true but path is local", async () => {
    const fixturePath = path.resolve(process.cwd(), "fixtures/schema.json")

    await expect(
      loadDescriptor({ path: fixturePath, onlyRemote: true }),
    ).rejects.toThrow("Cannot load descriptor for security reasons")
  })
})
