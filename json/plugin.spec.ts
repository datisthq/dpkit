import type { Resource } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { JsonPlugin } from "./plugin.ts"
import * as tableModule from "./table/index.ts"

vi.mock("./table/index.ts", () => ({
  loadJsonTable: vi.fn(),
  saveJsonTable: vi.fn(),
}))

describe("JsonPlugin", () => {
  let plugin: JsonPlugin
  let mockLoadJsonTable: ReturnType<typeof vi.fn>
  let mockSaveJsonTable: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new JsonPlugin()
    mockLoadJsonTable = vi.mocked(tableModule.loadJsonTable)
    mockSaveJsonTable = vi.mocked(tableModule.saveJsonTable)
    vi.clearAllMocks()
  })

  describe("loadTable", () => {
    it("should load table from json file", async () => {
      const resource: Partial<Resource> = {
        path: "test.json",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "json" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should load table from jsonl file", async () => {
      const resource: Partial<Resource> = {
        path: "test.jsonl",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "jsonl" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should load table from ndjson file", async () => {
      const resource: Partial<Resource> = {
        path: "test.ndjson",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "ndjson" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-json files", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadJsonTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "json",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "json" },
        undefined,
      )
      expect(result).toEqual(mockTable)
    })

    it("should pass through load options", async () => {
      const resource: Partial<Resource> = {
        path: "test.json",
      }
      const options = { denormalized: true }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource, options)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "json" },
        options,
      )
    })

    it("should handle paths with directories", async () => {
      const resource: Partial<Resource> = {
        path: "/path/to/data.json",
      }
      const mockTable = pl.DataFrame().lazy()
      mockLoadJsonTable.mockResolvedValue(mockTable)

      await plugin.loadTable(resource)

      expect(mockLoadJsonTable).toHaveBeenCalledWith(
        { ...resource, format: "json" },
        undefined,
      )
    })
  })

  describe("saveTable", () => {
    it("should save table to json file", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.json" }
      mockSaveJsonTable.mockResolvedValue({ path: "output.json" })

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "json",
      })
      expect(result).toEqual({ path: "output.json" })
    })

    it("should save table to jsonl file", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.jsonl" }
      mockSaveJsonTable.mockResolvedValue({ path: "output.jsonl" })

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "jsonl",
      })
      expect(result).toEqual({ path: "output.jsonl" })
    })

    it("should save table to ndjson file", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.ndjson" }
      mockSaveJsonTable.mockResolvedValue({ path: "output.ndjson" })

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "ndjson",
      })
      expect(result).toEqual({ path: "output.ndjson" })
    })

    it("should return undefined for non-json files", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output.txt", format: "json" as const }
      mockSaveJsonTable.mockResolvedValue({ path: "output.txt" })

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "json",
      })
      expect(result).toEqual({ path: "output.txt" })
    })

    it("should handle paths with directories", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "/path/to/output.json" }
      mockSaveJsonTable.mockResolvedValue({ path: "/path/to/output.json" })

      await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "json",
      })
    })

    it("should return undefined for files without extension", async () => {
      const table = pl.DataFrame().lazy()
      const options = { path: "output" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveJsonTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
