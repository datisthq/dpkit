import type { Package } from "@dpkit/core"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/load.ts"
import { ZenodoPlugin } from "./plugin.ts"

vi.mock("./package/load.ts", () => ({
  loadPackageFromZenodo: vi.fn(),
}))

describe("ZenodoPlugin", () => {
  let plugin: ZenodoPlugin
  let mockLoadPackageFromZenodo: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new ZenodoPlugin()
    mockLoadPackageFromZenodo = vi.mocked(packageModule.loadPackageFromZenodo)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from zenodo.org url", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromZenodo.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageFromZenodo).toHaveBeenCalledWith(
        "https://zenodo.org/record/123",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for non-zenodo urls", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromZenodo).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local paths", async () => {
      const result = await plugin.loadPackage("./data")

      expect(mockLoadPackageFromZenodo).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for github urls", async () => {
      const result = await plugin.loadPackage("https://github.com/owner/repo")

      expect(mockLoadPackageFromZenodo).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle sandbox.zenodo.org urls", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromZenodo.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://sandbox.zenodo.org/record/456",
      )

      expect(mockLoadPackageFromZenodo).toHaveBeenCalledWith(
        "https://sandbox.zenodo.org/record/456",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle zenodo urls with paths", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromZenodo.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://zenodo.org/record/123/files/data.zip",
      )

      expect(mockLoadPackageFromZenodo).toHaveBeenCalledWith(
        "https://zenodo.org/record/123/files/data.zip",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should handle zenodo urls with query parameters", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromZenodo.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(
        "https://zenodo.org/record/123?preview=1",
      )

      expect(mockLoadPackageFromZenodo).toHaveBeenCalledWith(
        "https://zenodo.org/record/123?preview=1",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for http non-zenodo urls", async () => {
      const result = await plugin.loadPackage("http://example.com/data")

      expect(mockLoadPackageFromZenodo).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
