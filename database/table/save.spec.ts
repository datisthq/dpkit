import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveDatabaseTable } from "./save.js"

describe("saveDatabaseTable", () => {
  const mockTable = DataFrame({ col1: [1, 2, 3] }).lazy()

  it("throws error when format is not supported", async () => {
    await expect(
      saveDatabaseTable(mockTable, {
        format: "unsupported" as any,
        path: "test.db",
        dialect: { table: "test_table" },
      }),
    ).rejects.toThrow("Supported database format is not defined")
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      saveDatabaseTable(mockTable, {
        format: "sqlite",
        path: "test.db",
        dialect: {},
      }),
    ).rejects.toThrow("Table name is not defined in dialect")
  })
})
