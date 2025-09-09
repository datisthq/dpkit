import { describe, expect, it } from "vitest"
import { inferDatabaseSchema } from "./infer.js"

describe("inferDatabaseSchema", () => {
  it("throws error when format is not supported", async () => {
    await expect(
      inferDatabaseSchema({ format: "unsupported" as any }),
    ).rejects.toThrow("Supported database format is not defined")
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      inferDatabaseSchema({
        format: "sqlite",
        dialect: {},
        path: "path",
      }),
    ).rejects.toThrow("Table name is not defined in dialect")
  })

  it("throws error when resource path is not defined", async () => {
    await expect(
      inferDatabaseSchema({
        format: "sqlite",
        dialect: { table: "test_table" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })

  it("throws error when table is not found in database", async () => {
    await expect(
      inferDatabaseSchema({
        format: "sqlite",
        path: "path",
        dialect: { table: "nonexistent_table" },
      }),
    ).rejects.toThrow("Table is not found in database: nonexistent_table")
  })
})

