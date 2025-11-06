import type { Package } from "@dpkit/metadata"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/index.ts"
import { ZipPlugin } from "./plugin.ts"

vi.mock("./package/index.ts", () => ({
  loadPackageFromZip: vi.fn(),
  savePackageToZip: vi.fn(),
}))

describe("ZipPlugin", () => {
  let plugin: ZipPlugin
  let mockLoadPackageFromZip: ReturnType<typeof vi.fn>
  let mockSavePackageToZip: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new ZipPlugin()
    mockLoadPackageFromZip = vi.mocked(packageModule.loadPackageFromZip)
    mockSavePackageToZip = vi.mocked(packageModule.savePackageToZip)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from zip file", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test-resource", data: [] }],
      }
      mockLoadPackageFromZip.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("test.zip")

      expect(mockLoadPackageFromZip).toHaveBeenCalledWith("test.zip")
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for non-zip files", async () => {
      const result = await plugin.loadPackage("test.json")

      expect(mockLoadPackageFromZip).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should recognize .zip extension case-insensitively", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [],
      }
      mockLoadPackageFromZip.mockResolvedValue(mockPackage)

      await plugin.loadPackage("test.zip")

      expect(mockLoadPackageFromZip).toHaveBeenCalledWith("test.zip")
    })

    it("should handle paths with directories", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [],
      }
      mockLoadPackageFromZip.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("/path/to/file.zip")

      expect(mockLoadPackageFromZip).toHaveBeenCalledWith("/path/to/file.zip")
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for files without extension", async () => {
      const result = await plugin.loadPackage("test")

      expect(mockLoadPackageFromZip).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("savePackage", () => {
    it("should save package to zip file", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [{ name: "test-resource", data: [] }],
      }
      mockSavePackageToZip.mockResolvedValue(undefined)

      const result = await plugin.savePackage(dataPackage, {
        target: "output.zip",
      })

      expect(mockSavePackageToZip).toHaveBeenCalledWith(dataPackage, {
        archivePath: "output.zip",
        withRemote: false,
      })
      expect(result).toEqual({ path: undefined })
    })

    it("should return undefined for non-zip targets", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [],
      }

      const result = await plugin.savePackage(dataPackage, {
        target: "output.json",
      })

      expect(mockSavePackageToZip).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should pass withRemote option", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [],
      }
      mockSavePackageToZip.mockResolvedValue(undefined)

      await plugin.savePackage(dataPackage, {
        target: "output.zip",
        withRemote: true,
      })

      expect(mockSavePackageToZip).toHaveBeenCalledWith(dataPackage, {
        archivePath: "output.zip",
        withRemote: true,
      })
    })

    it("should handle withRemote as false when not provided", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [],
      }
      mockSavePackageToZip.mockResolvedValue(undefined)

      await plugin.savePackage(dataPackage, {
        target: "output.zip",
      })

      expect(mockSavePackageToZip).toHaveBeenCalledWith(dataPackage, {
        archivePath: "output.zip",
        withRemote: false,
      })
    })

    it("should handle paths with directories", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [],
      }
      mockSavePackageToZip.mockResolvedValue(undefined)

      await plugin.savePackage(dataPackage, {
        target: "/path/to/output.zip",
      })

      expect(mockSavePackageToZip).toHaveBeenCalledWith(dataPackage, {
        archivePath: "/path/to/output.zip",
        withRemote: false,
      })
    })

    it("should save package with metadata", async () => {
      const dataPackage: Package = {
        name: "test-package",
        title: "Test Package",
        description: "A test package",
        resources: [],
      }
      mockSavePackageToZip.mockResolvedValue(undefined)

      await plugin.savePackage(dataPackage, {
        target: "output.zip",
      })

      expect(mockSavePackageToZip).toHaveBeenCalledWith(dataPackage, {
        archivePath: "output.zip",
        withRemote: false,
      })
    })

    it("should return undefined for files without extension", async () => {
      const dataPackage: Package = {
        name: "test-package",
        resources: [],
      }

      const result = await plugin.savePackage(dataPackage, {
        target: "output",
      })

      expect(mockSavePackageToZip).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
