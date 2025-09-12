import { describe, expect, it } from "vitest"
import { loadDatabaseTable } from "./load.ts"

describe("loadDatabaseTable", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      loadDatabaseTable({
        format: "sqlite",
        dialect: { table: "dpkit" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      loadDatabaseTable({
        path: "path",
        format: "sqlite",
      }),
    ).rejects.toThrow("Table name is not defined in dialect")
  })

  it("throws error when format is not supported", async () => {
    await expect(
      loadDatabaseTable({
        path: "path",
        format: "unsupported" as any,
        dialect: { table: "dpkit" },
      }),
    ).rejects.toThrow('Unsupported database format: "unsupported"')
  })
})
