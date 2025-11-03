import type { Resource } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { CsvPlugin } from "./plugin.ts"
import * as tableModule from "./table/index.ts"

vi.mock("./table/index.ts", () => ({
  loadCsvTable: vi.fn(),
  saveCsvTable: vi.fn(),
}))

describe("CsvPlugin", () => {
  let plugin: CsvPlugin
  let mockLoadCsvTable: ReturnType<typeof vi.fn>
  let mockSaveCsvTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new CsvPlugin()
    mockLoadCsvTable = vi.mocked(tableModule.loadCsvTable)
    mockSaveCsvTable = vi.mocked(tableModule.saveCsvTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from csv file", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "csv" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should load table from tsv file", async () => {
      const resource: Partial<Resource> = {
        path: "test.tsv",
      }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "tsv" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-csv files", async () => {
      const resource: Partial<Resource> = {
        path: "test.json",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadCsvTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "csv",
      }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "csv" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }
      const options = { denormalized: true }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "csv" },
        options,
      )
    })

    it("should handle paths with directories", async () => {
      const resource: Partial<Resource> = {
        path: "/path/to/data.csv",
      }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "csv" },
        undefined,
      )
    })

    it("should handle explicit tsv format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "tsv",
      }
      const mockTable = DataFrame().lazy()
      mockLoadCsvTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadCsvTable).toHaveBeenCalledWith(
        { ...resource, format: "tsv" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })
  })

  describe("saveTable", () => {
    it("should save table to csv file", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.csv" }
      mockSaveCsvTable.mockResolvedValue("output.csv")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "csv",
      })
      expect(result).toBe("output.csv")
    })

    it("should save table to tsv file", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.tsv" }
      mockSaveCsvTable.mockResolvedValue("output.tsv")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "tsv",
      })
      expect(result).toBe("output.tsv")
    })

    it("should return undefined for non-csv files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.json" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.txt", format: "csv" as const }
      mockSaveCsvTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "csv",
      })
      expect(result).toBe("output.txt")
    })

    it("should handle paths with directories", async () => {
      const table = DataFrame().lazy()
      const options = { path: "/path/to/output.csv" }
      mockSaveCsvTable.mockResolvedValue("/path/to/output.csv")

      await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "csv",
      })
    })

    it("should return undefined for files without extension", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit tsv format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.txt", format: "tsv" as const }
      mockSaveCsvTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveCsvTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "tsv",
      })
      expect(result).toBe("output.txt")
    })
  })
})
