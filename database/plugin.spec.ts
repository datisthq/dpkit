import type { Package, Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import * as packageModule from "./package/index.ts"
import { DatabasePlugin } from "./plugin.ts"
import * as schemaModule from "./schema/index.ts"
import * as tableModule from "./table/index.ts"

vi.mock("./package/index.ts", () => ({
  loadPackageFromDatabase: vi.fn(),
  savePackageToDatabase: vi.fn(),
}))

vi.mock("./table/index.ts", () => ({
  loadDatabaseTable: vi.fn(),
  saveDatabaseTable: vi.fn(),
}))

vi.mock("./schema/index.ts", () => ({
  inferDatabaseSchema: vi.fn(),
}))

describe("DatabasePlugin", () => {
  let plugin: DatabasePlugin
  let mockLoadPackageFromDatabase: ReturnType<typeof vi.fn>
  let mockSavePackageToDatabase: ReturnType<typeof vi.fn>
  let mockLoadDatabaseTable: ReturnType<typeof vi.fn>
  let mockSaveDatabaseTable: ReturnType<typeof vi.fn>
  let mockInferDatabaseSchema: ReturnType<typeof vi.fn>

  beforeEach(() => {
    plugin = new DatabasePlugin()
    mockLoadPackageFromDatabase = vi.mocked(
      packageModule.loadPackageFromDatabase,
    )
    mockSavePackageToDatabase = vi.mocked(packageModule.savePackageToDatabase)
    mockLoadDatabaseTable = vi.mocked(tableModule.loadDatabaseTable)
    mockSaveDatabaseTable = vi.mocked(tableModule.saveDatabaseTable)
    mockInferDatabaseSchema = vi.mocked(schemaModule.inferDatabaseSchema)
    vi.clearAllMocks()
  })

  describe("loadPackage", () => {
    it("should load package from postgresql database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatabase.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("postgresql://localhost/testdb")

      expect(mockLoadPackageFromDatabase).toHaveBeenCalledWith(
        "postgresql://localhost/testdb",
        { format: "postgresql" },
      )
      expect(result).toEqual(mockPackage)
    })

    it("should load package from mysql database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatabase.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("mysql://localhost/testdb")

      expect(mockLoadPackageFromDatabase).toHaveBeenCalledWith(
        "mysql://localhost/testdb",
        { format: "mysql" },
      )
      expect(result).toEqual(mockPackage)
    })

    it("should load package from sqlite database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockLoadPackageFromDatabase.mockResolvedValue(mockPackage)

      const result = await plugin.loadPackage("sqlite://test.db")

      expect(mockLoadPackageFromDatabase).toHaveBeenCalledWith(
        "sqlite://test.db",
        {
          format: "sqlite",
        },
      )
      expect(result).toEqual(mockPackage)
    })

    it("should return undefined for non-database sources", async () => {
      const result = await plugin.loadPackage("test.csv")

      expect(mockLoadPackageFromDatabase).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should return undefined for http urls", async () => {
      const result = await plugin.loadPackage("https://example.com/data")

      expect(mockLoadPackageFromDatabase).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("savePackage", () => {
    it("should save package to postgresql database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockSavePackageToDatabase.mockResolvedValue(undefined)

      await plugin.savePackage(mockPackage, {
        target: "postgresql://localhost/testdb",
      })

      expect(mockSavePackageToDatabase).toHaveBeenCalledWith(mockPackage, {
        target: "postgresql://localhost/testdb",
        format: "postgresql",
      })
    })

    it("should save package to mysql database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockSavePackageToDatabase.mockResolvedValue(undefined)

      await plugin.savePackage(mockPackage, {
        target: "mysql://localhost/testdb",
      })

      expect(mockSavePackageToDatabase).toHaveBeenCalledWith(mockPackage, {
        target: "mysql://localhost/testdb",
        format: "mysql",
      })
    })

    it("should save package to sqlite database", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      mockSavePackageToDatabase.mockResolvedValue(undefined)

      await plugin.savePackage(mockPackage, { target: "sqlite://test.db" })

      expect(mockSavePackageToDatabase).toHaveBeenCalledWith(mockPackage, {
        target: "sqlite://test.db",
        format: "sqlite",
      })
    })

    it("should return undefined for non-database targets", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }

      const result = await plugin.savePackage(mockPackage, {
        target: "test.csv",
      })

      expect(mockSavePackageToDatabase).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should pass through plugins option", async () => {
      const mockPackage: Package = {
        name: "test-package",
        resources: [{ name: "test", data: [] }],
      }
      const mockPlugins: any[] = []
      mockSavePackageToDatabase.mockResolvedValue(undefined)

      await plugin.savePackage(mockPackage, {
        target: "sqlite://test.db",
        plugins: mockPlugins,
      })

      expect(mockSavePackageToDatabase).toHaveBeenCalledWith(mockPackage, {
        target: "sqlite://test.db",
        format: "sqlite",
        plugins: mockPlugins,
      })
    })
  })

  describe("loadTable", () => {
    it("should load table from postgresql resource", async () => {
      const resource: Partial<Resource> = {
        path: "postgresql://localhost/testdb",
      }
      const mockTable = DataFrame().lazy()
      mockLoadDatabaseTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadDatabaseTable).toHaveBeenCalledWith({
        ...resource,
        format: "postgresql",
      })
      expect(result).toEqual(mockTable)
    })

    it("should load table from mysql resource", async () => {
      const resource: Partial<Resource> = {
        path: "mysql://localhost/testdb",
      }
      const mockTable = DataFrame().lazy()
      mockLoadDatabaseTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadDatabaseTable).toHaveBeenCalledWith({
        ...resource,
        format: "mysql",
      })
      expect(result).toEqual(mockTable)
    })

    it("should load table from sqlite resource", async () => {
      const resource: Partial<Resource> = {
        path: "sqlite://test.db",
      }
      const mockTable = DataFrame().lazy()
      mockLoadDatabaseTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadDatabaseTable).toHaveBeenCalledWith({
        ...resource,
        format: "sqlite",
      })
      expect(result).toEqual(mockTable)
    })

    it("should return undefined for non-database resources", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.loadTable(resource)

      expect(mockLoadDatabaseTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "sqlite",
      }
      const mockTable = DataFrame().lazy()
      mockLoadDatabaseTable.mockResolvedValue(mockTable)

      const result = await plugin.loadTable(resource)

      expect(mockLoadDatabaseTable).toHaveBeenCalledWith({
        ...resource,
        format: "sqlite",
      })
      expect(result).toEqual(mockTable)
    })
  })

  describe("saveTable", () => {
    it("should save table to postgresql database", async () => {
      const table = DataFrame().lazy()
      const options = { path: "postgresql://localhost/testdb" }
      mockSaveDatabaseTable.mockResolvedValue("postgresql://localhost/testdb")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveDatabaseTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "postgresql",
      })
      expect(result).toBe("postgresql://localhost/testdb")
    })

    it("should save table to mysql database", async () => {
      const table = DataFrame().lazy()
      const options = { path: "mysql://localhost/testdb" }
      mockSaveDatabaseTable.mockResolvedValue("mysql://localhost/testdb")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveDatabaseTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "mysql",
      })
      expect(result).toBe("mysql://localhost/testdb")
    })

    it("should save table to sqlite database", async () => {
      const table = DataFrame().lazy()
      const options = { path: "sqlite://test.db" }
      mockSaveDatabaseTable.mockResolvedValue("sqlite://test.db")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveDatabaseTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "sqlite",
      })
      expect(result).toBe("sqlite://test.db")
    })

    it("should return undefined for non-database paths", async () => {
      const table = DataFrame().lazy()
      const options = { path: "output.csv" }

      const result = await plugin.saveTable(table, options)

      expect(mockSaveDatabaseTable).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const table = DataFrame().lazy()
      const options = { path: "test.txt", format: "sqlite" as const }
      mockSaveDatabaseTable.mockResolvedValue("test.txt")

      const result = await plugin.saveTable(table, options)

      expect(mockSaveDatabaseTable).toHaveBeenCalledWith(table, {
        ...options,
        format: "sqlite",
      })
      expect(result).toBe("test.txt")
    })
  })

  describe("inferSchema", () => {
    it("should infer schema for postgresql resource", async () => {
      const resource: Partial<Resource> = {
        path: "postgresql://localhost/testdb",
      }
      const mockSchema = { fields: [] }
      mockInferDatabaseSchema.mockResolvedValue(mockSchema)

      const result = await plugin.inferSchema(resource)

      expect(mockInferDatabaseSchema).toHaveBeenCalledWith({
        ...resource,
        format: "postgresql",
      })
      expect(result).toEqual(mockSchema)
    })

    it("should infer schema for mysql resource", async () => {
      const resource: Partial<Resource> = {
        path: "mysql://localhost/testdb",
      }
      const mockSchema = { fields: [] }
      mockInferDatabaseSchema.mockResolvedValue(mockSchema)

      const result = await plugin.inferSchema(resource)

      expect(mockInferDatabaseSchema).toHaveBeenCalledWith({
        ...resource,
        format: "mysql",
      })
      expect(result).toEqual(mockSchema)
    })

    it("should infer schema for sqlite resource", async () => {
      const resource: Partial<Resource> = {
        path: "sqlite://test.db",
      }
      const mockSchema = { fields: [] }
      mockInferDatabaseSchema.mockResolvedValue(mockSchema)

      const result = await plugin.inferSchema(resource)

      expect(mockInferDatabaseSchema).toHaveBeenCalledWith({
        ...resource,
        format: "sqlite",
      })
      expect(result).toEqual(mockSchema)
    })

    it("should return undefined for non-database resources", async () => {
      const resource: Partial<Resource> = {
        path: "test.csv",
      }

      const result = await plugin.inferSchema(resource)

      expect(mockInferDatabaseSchema).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it("should handle explicit format specification", async () => {
      const resource: Partial<Resource> = {
        path: "test.txt",
        format: "sqlite",
      }
      const mockSchema = { fields: [] }
      mockInferDatabaseSchema.mockResolvedValue(mockSchema)

      const result = await plugin.inferSchema(resource)

      expect(mockInferDatabaseSchema).toHaveBeenCalledWith({
        ...resource,
        format: "sqlite",
      })
      expect(result).toEqual(mockSchema)
    })
  })
})
