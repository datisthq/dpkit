import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { OdsPlugin } from "./plugin.ts"
import * as tableModule from "./table/index.ts"

vi.mock("./table/index.ts", () => ({
  loadOdsTable: vi.fn(),
  saveOdsTable: vi.fn(),
}))

describe("OdsPlugin", () => {
  let plugin: OdsPlugin
  let mockLoadOdsTable: ReturnType<typeof vi.fn>
  let mockSaveOdsTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new OdsPlugin()
    mockLoadOdsTable = vi.mocked(tableModule.loadOdsTable)
    mockSaveOdsTable = vi.mocked(tableModule.saveOdsTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from ods file", async () => {
      const resource: Partial<Resource> = {
        path: "test.ods",
      }
      const mockTable = DataFrame().lazy()
      mockLoadOdsTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadOdsTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-ods files", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "ods",
      }
      const mockTable = DataFrame().lazy()
      mockLoadOdsTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadOdsTable).toHaveBeenCalledWith(resource, undefined)
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Partial<Resource> = {
        path: "test.ods",
      }
      const options = { denormalized: true }
      const mockTable = DataFrame().lazy()
      mockLoadOdsTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadOdsTable).toHaveBeenCalledWith(resource, options)
    })

    it("should handle paths with directories", async () => {
      const resource: Partial<Resource> = {
        path: "/path/to/data.ods",
      }
      const mockTable = DataFrame().lazy()
      mockLoadOdsTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadOdsTable).toHaveBeenCalledWith(resource, undefined)
    })

    it("should return undefined for json files", async () => {
      const resource: Partial<Resource> = {
        path: "test.json",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for xlsx files", async () => {
      const resource: Partial<Resource> = {
        path: "test.xlsx",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("saveTable", () => {
    it("should save table to ods file", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.ods" }
      mockSaveOdsTable.mockResolvedValue("output.ods")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.ods")
    })

    it("should return undefined for non-ods files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.txt", format: "ods" as const }
      mockSaveOdsTable.mockResolvedValue("output.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).toHaveBeenCalledWith(table, options)
      expect(result).toBe("output.txt")
    })

    it("should handle paths with directories", async () => {
      const table = DataFrame().lazy()
      const options = { path: "/path/to/output.ods" }
      mockSaveOdsTable.mockResolvedValue("/path/to/output.ods")

      await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).toHaveBeenCalledWith(table, options)
    })

    it("should return undefined for files without extension", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for xlsx files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.xlsx" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for json files", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.json" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveOdsTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
