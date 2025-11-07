import type { Package } from "@dpkit/metadata"
import * as metadataModule from "@dpkit/metadata"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DescriptorPlugin } from "./plugin.ts"

vi.mock("@dpkit/metadata", async () => {
  const actual = await vi.importActual("@dpkit/metadata")
  return {
    ...actual,
    loadPackageDescriptor: vi.fn(),
    savePackageDescriptor: vi.fn(),
  }
})

describe("DescriptorPlugin", () => {
  let plugin: DescriptorPlugin
  let mockLoadPackageDescriptor: ReturnType<typeof vi.fn>
  let mockSavePackageDescriptor: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new DescriptorPlugin()
    mockLoadPackageDescriptor = vi.mocked(metadataModule.loadPackageDescriptor)
    mockSavePackageDescriptor = vi.mocked(metadataModule.savePackageDescriptor)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from local datapackage.json file", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageDescriptor.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("./datapackage.json")

      expect(mockLoadPackageDescriptor).toHaveBeenCalledWith(
        "./datapackage.json",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should load package from local json file", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageDescriptor.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("./package.json")

      expect(mockLoadPackageDescriptor).toHaveBeenCalledWith("./package.json")
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for remote json urls", async () => {
      const result = await plugin.loadPackage(
        "https://example.com/datapackage.json",
      )

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for http remote json urls", async () => {
      const result = await plugin.loadPackage(
        "http://example.com/datapackage.json",
      )

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local csv files", async () => {
      const result = await plugin.loadPackage("./data.csv")

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local xlsx files", async () => {
      const result = await plugin.loadPackage("./data.xlsx")

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local parquet files", async () => {
      const result = await plugin.loadPackage("./data.parquet")

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle absolute paths", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageDescriptor.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("/absolute/path/datapackage.json")

      expect(mockLoadPackageDescriptor).toHaveBeenCalledWith(
        "/absolute/path/datapackage.json",
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for github urls", async () => {
      const result = await plugin.loadPackage(
        "https://github.com/owner/repo/datapackage.json",
      )

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for zenodo urls", async () => {
      const result = await plugin.loadPackage("https://zenodo.org/record/123")

      expect(mockLoadPackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("savePackage", () => {
    const mockPackage: Package = {
      name: "test-package",
      resources: [{ name: "test", data: [] }],
    }

    it("should save package to local datapackage.json file", async () => {
      mockSavePackageDescriptor.mockResolvedValue(undefined)

      const result = await plugin.savePackage(mockPackage, {
        target: "./datapackage.json",
      })

      expect(mockSavePackageDescriptor).toHaveBeenCalledWith(mockPackage, {
        path: "./datapackage.json",
      })
      expect(result).toEqual({ path: "./datapackage.json" })
    })

    it("should save package with absolute path", async () => {
      mockSavePackageDescriptor.mockResolvedValue(undefined)

      const result = await plugin.savePackage(mockPackage, {
        target: "/absolute/path/datapackage.json",
      })

      expect(mockSavePackageDescriptor).toHaveBeenCalledWith(mockPackage, {
        path: "/absolute/path/datapackage.json",
      })
      expect(result).toEqual({ path: "/absolute/path/datapackage.json" })
    })

    it("should return undefined for remote urls", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "https://example.com/datapackage.json",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local json files not named datapackage.json", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "./package.json",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local csv files", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "./data.csv",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for local xlsx files", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "./data.xlsx",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for http urls", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "http://example.com/datapackage.json",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should ignore withRemote option for local files", async () => {
      mockSavePackageDescriptor.mockResolvedValue(undefined)

      const result = await plugin.savePackage(mockPackage, {
        target: "./datapackage.json",
        withRemote: true,
      })

      expect(mockSavePackageDescriptor).toHaveBeenCalledWith(mockPackage, {
        path: "./datapackage.json",
      })
      expect(result).toEqual({ path: "./datapackage.json" })
    })

    it("should return undefined for local directories", async () => {
      const result = await plugin.savePackage(mockPackage, {
        target: "./data",
      })

      expect(mockSavePackageDescriptor).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
