import { describe, expect, it } from "vitest"
import { inferDatabaseSchema } from "./infer.ts"

// TODO: Enable when SQLite support is fixed
describe.skip("inferDatabaseSchema", () => {
  it("throws error when resource path is not defined", async () => {
    await expect(
      inferDatabaseSchema({
        format: "sqlite",
        dialect: { table: "dpkit" },
      }),
    ).rejects.toThrow("Resource path is not defined")
  })

  it("throws error when table name is not defined in dialect", async () => {
    await expect(
      inferDatabaseSchema({
        path: "path",
        format: "sqlite",
      }),
    ).rejects.toThrow("Table name is not defined in dialect")
  })

  it("throws error when format is not supported", async () => {
    await expect(
      inferDatabaseSchema({
        path: "path",
        format: "unsupported" as any,
        dialect: { table: "dpkit" },
      }),
    ).rejects.toThrow('Unsupported database format: "unsupported"')
  })
})
