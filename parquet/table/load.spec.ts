import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { loadParquetTable } from "./load.js"

describe("loadParquetTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      await temporaryFileTask(async path => {
        DataFrame({
          id: [1, 2],
          name: ["english", "中文"],
        }).writeParquet(path)

        const table = await loadParquetTable({ path })
        expect(table).toBeDefined()
      })
    })
  })
})
