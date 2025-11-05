import type { Resource } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ParquetPlugin } from "./plugin.ts"
import * as loadModule from "./table/load.ts"
import * as saveModule from "./table/save.ts"

vi.mock("./table/load.ts", () => ({
  loadParquetTable: vi.fn(),
}))

vi.mock("./table/save.ts", () => ({
  saveParquetTable: vi.fn(),
}))

describe("ParquetPlugin", () => {
  let plugin: ParquetPlugin
  let mockLoadParquetTable: ReturnType<typeof vi.fn>
  let mockSaveParquetTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new ParquetPlugin()
    mockLoadParquetTable = vi.mocked(loadModule.loadParquetTable)
    mockSaveParquetTable = vi.mocked(saveModule.saveParquetTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from parquet file", async () => {
      const resource: Partial<Resource> = {
        path: "test.parquet",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadParquetTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadParquetTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-parquet files", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "parquet",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadParquetTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadParquetTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Partial<Resource> = {
        path: "test.parquet",
      }
      const options = { denormalized: true }
      const mockTable = pl.DataFrame().lazy()
      mockLoadParquetTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadParquetTable).toHaveBeenCalledWith(resource, options)
    })

    it("should handle paths with directories", async () => {
      const resource: Partial<Resource> = {
        path: "/path/to/data.parquet",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadParquetTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadParquetTable).toHaveBeenCalledWith(resource, undefined)
    })

    it("should return undefined for arrow files", async () => {
      const resource: Partial<Resource> = {
        path: "test.arrow",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for json files", async () => {
      const resource: Partial<Resource> = {
        path: "test.json",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("saveTable", () => {
    it("should save table to parquet file", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.parquet" }
      mockSaveParquetTable.mockResolvedValue("output.parquet")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.parquet")
    })

    it("should return undefined for non-parquet files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.txt", format: "parquet" as const }
      mockSaveParquetTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.txt")
    })

    it("should handle paths with directories", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "/path/to/output.parquet" }
      mockSaveParquetTable.mockResolvedValue("/path/to/output.parquet")

      await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).toHaveBeenCalledWith(table, options)
    })

    it("should return undefined for files without extension", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for arrow files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.arrow" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for json files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.json" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveParquetTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
