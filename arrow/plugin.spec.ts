import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ArrowPlugin } from "./plugin.ts"
import * as tableModule from "./table/index.ts"

vi.mock("./table/index.ts", () => ({
  loadArrowTable: vi.fn(),
  saveArrowTable: vi.fn(),
}))

describe("ArrowPlugin", () => {
  let plugin: ArrowPlugin
  let mockLoadArrowTable: ReturnType<typeof vi.fn>
  let mockSaveArrowTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new ArrowPlugin()
    mockLoadArrowTable = vi.mocked(tableModule.loadArrowTable)
    mockSaveArrowTable = vi.mocked(tableModule.saveArrowTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from arrow file", async () => {
      const resource: Partial<Resource> = {
        path: "test.arrow",
      }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should load table from feather file", async () => {
      const resource: Partial<Resource> = {
        path: "test.feather",
      }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-arrow files", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit arrow format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "arrow",
      }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should handle explicit feather format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "feather",
      }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Partial<Resource> = {
        path: "test.arrow",
      }
      const options = { denormalized: true }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, options)
    })

    it("should handle paths with directories", async () => {
      const resource: Partial<Resource> = {
        path: "/path/to/data.arrow",
      }
      const mockTable = DataFrame().lazy()
      mockLoadArrowTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadArrowTable).toHaveBeenCalledWith(resource, undefined)
    })

    it("should return undefined for parquet files", async () => {
      const resource: Partial<Resource> = {
        path: "test.parquet",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadArrowTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("saveTable", () => {
    it("should save table to arrow file", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.arrow" }
      mockSaveArrowTable.mockResolvedValue("output.arrow")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.arrow")
    })

    it("should save table to feather file", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.feather" }
      mockSaveArrowTable.mockResolvedValue("output.feather")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.feather")
    })

    it("should return undefined for non-arrow files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit arrow format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.txt", format: "arrow" as const }
      mockSaveArrowTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.txt")
    })

    it("should handle explicit feather format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.txt", format: "feather" as const }
      mockSaveArrowTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.txt")
    })

    it("should handle paths with directories", async () => {
      const table = DataFrame().lazy()
      const options = { path: "/path/to/output.arrow" }
      mockSaveArrowTable.mockResolvedValue("/path/to/output.arrow")

      await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).toHaveBeenCalledWith(table, options)
    })

    it("should return undefined for files without extension", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for parquet files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.parquet" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveArrowTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
