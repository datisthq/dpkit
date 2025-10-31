import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { loadDescriptor } from "./load.ts"

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
    const descriptor = await loadDescriptor(getFixturePath("schema.json"))

    expect(descriptor).toEqual(expectedDescriptor)
  })

  it("loads a remote descriptor from a URL", async () => {
    const testUrl = "https://example.com/schema.json"

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(expectedDescriptor),
    })

    const descriptor = await loadDescriptor(testUrl)

    expect(descriptor).toEqual(expectedDescriptor)
    expect(fetch).toHaveBeenCalledWith(testUrl)
  })

  it("throws error for unsupported URL protocol", async () => {
    const testUrl = "bad:///path/to/schema.json"

    await expect(loadDescriptor(testUrl)).rejects.toThrow(
      "Unsupported remote protocol: bad",
    )
  })

  it("throws error when onlyRemote is true but path is local", async () => {
    await expect(
      loadDescriptor(getFixturePath("schema.json"), { onlyRemote: true }),
    ).rejects.toThrow("Cannot load descriptor for security reasons")
  })
})
