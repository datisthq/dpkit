import type { Package } from "@dpkit/metadata"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/index.ts"
import { FolderPlugin } from "./plugin.ts"

vi.mock("./package/index.ts", () => ({
  loadPackageFromFolder: vi.fn(),
}))

describe("FolderPlugin", () => {
  let plugin: FolderPlugin
  let mockLoadPackageFromFolder: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new FolderPlugin()
    mockLoadPackageFromFolder = vi.mocked(packageModule.loadPackageFromFolder)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from local directory", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromFolder.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage(".")

      expect(mockLoadPackageFromFolder).toHaveBeenCalledWith(".")
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for remote paths", async () => {
      const result = await plugin.loadPackage("http://example.com/data")

      expect(mockLoadPackageFromFolder).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for https paths", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromFolder).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for github urls", async () => {
      const result = await plugin.loadPackage(
        "https://github.com/owner/repo/data",
      )

      expect(mockLoadPackageFromFolder).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for ftp paths", async () => {
      const result = await plugin.loadPackage("ftp://example.com/data")

      expect(mockLoadPackageFromFolder).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for zenodo urls", async () => {
      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageFromFolder).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
