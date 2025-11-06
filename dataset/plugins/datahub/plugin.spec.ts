import type { Package } from "@dpkit/metadata"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/index.ts"
import { DatahubPlugin } from "./plugin.ts"

vi.mock("./package/index.ts", () => ({
  loadPackageFromDatahub: vi.fn(),
}))

describe("DatahubPlugin", () => {
  let plugin: DatahubPlugin
  let mockLoadPackageFromDatahub: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new DatahubPlugin()
    mockLoadPackageFromDatahub = vi.mocked(packageModule.loadPackageFromDatahub)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from datahub.io url", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatahub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://datahub.io/core/country-codes",
      )

      expect(mockLoadPackageFromDatahub).toHaveBeenCalledWith(
        "https://datahub.io/core/country-codes",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for non-datahub urls", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local paths", async () => {
      const result = await plugin.loadPackage("./data")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for github urls", async () => {
      const result = await plugin.loadPackage("https://github.com/owner/repo")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle datahub urls with multiple path segments", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatahub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://datahub.io/core/gdp/datapackage.json",
      )

      expect(mockLoadPackageFromDatahub).toHaveBeenCalledWith(
        "https://datahub.io/core/gdp/datapackage.json",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle datahub urls with query parameters", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatahub.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://datahub.io/core/country-codes?format=json",
      )

      expect(mockLoadPackageFromDatahub).toHaveBeenCalledWith(
        "https://datahub.io/core/country-codes?format=json",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for http non-datahub urls", async () => {
      const result = await plugin.loadPackage("http://example.com/data")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for zenodo urls", async () => {
      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for subdomain datahub urls", async () => {
      const result = await plugin.loadPackage("https://test.datahub.io/data")

      expect(mockLoadPackageFromDatahub).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
