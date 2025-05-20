import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { loadDescriptor } from "./load.js"

describe("loadDescriptor", () => {
  const getFixturePath = (name?: string) =>
    path.relative(
      process.cwd(),
      path.join(import.meta.dirname, "fixtures", name ?? ""),
    )

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

    expect(basepath).toEqual(getFixturePath())
    expect(descriptor).toEqual(expectedDescriptor)
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
    await expect(
      loadDescriptor({ path: getFixturePath("schema.json"), onlyRemote: true }),
    ).rejects.toThrow("Cannot load descriptor for security reasons")
  })
})
