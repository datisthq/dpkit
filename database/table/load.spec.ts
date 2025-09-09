import { describe, expect, it } from "vitest"
import { loadDatabaseTable } from "./load.js"

describe("loadDatabaseTable", () => {
  it("throws error when format is not supported", async () => {
    await expect(
      loadDatabaseTable({ format: "unsupported" as any })
    ).rejects.toThrow("Supported database format is not defined")
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      loadDatabaseTable({
        format: "sqlite",
        dialect: {},
        path: "path",
      })
    ).rejects.toThrow("Table name is not defined in dialect")
  })

  it("throws error when resource path is not defined", async () => {
    await expect(
      loadDatabaseTable({
        format: "sqlite",
        dialect: { table: "test_table" },
      })
    ).rejects.toThrow("Resource path is not defined")
  })
})