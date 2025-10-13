import type { Package } from "@dpkit/core"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/load.ts"
import { CkanPlugin } from "./plugin.ts"

vi.mock("./package/load.ts", () => ({
  loadPackageFromCkan: vi.fn(),
}))

describe("CkanPlugin", () => {
  let plugin: CkanPlugin
  let mockLoadPackageFromCkan: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new CkanPlugin()
    mockLoadPackageFromCkan = vi.mocked(packageModule.loadPackageFromCkan)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from ckan url with /dataset/ path", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromCkan.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://data.example.com/dataset/test-dataset",
      )

      expect(mockLoadPackageFromCkan).toHaveBeenCalledWith(
        "https://data.example.com/dataset/test-dataset",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for urls without /dataset/", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromCkan).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local paths", async () => {
      const result = await plugin.loadPackage("./data")

      expect(mockLoadPackageFromCkan).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for github urls", async () => {
      const result = await plugin.loadPackage("https://github.com/owner/repo")

      expect(mockLoadPackageFromCkan).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle ckan urls with additional path segments", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromCkan.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://data.example.com/dataset/test-dataset/resource/123",
      )

      expect(mockLoadPackageFromCkan).toHaveBeenCalledWith(
        "https://data.example.com/dataset/test-dataset/resource/123",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle ckan urls with query parameters", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromCkan.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://data.example.com/dataset/test-dataset?id=456",
      )

      expect(mockLoadPackageFromCkan).toHaveBeenCalledWith(
        "https://data.example.com/dataset/test-dataset?id=456",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle http ckan urls", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromCkan.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "http://data.example.com/dataset/test-dataset",
      )

      expect(mockLoadPackageFromCkan).toHaveBeenCalledWith(
        "http://data.example.com/dataset/test-dataset",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for zenodo urls", async () => {
      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageFromCkan).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for urls with dataset in query params only", async () => {
      const result = await plugin.loadPackage(
        "https://example.com/api?name=dataset",
      )

      expect(mockLoadPackageFromCkan).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
