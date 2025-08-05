import { getTempFilePath } from "@dpkit/file"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadAvroTable } from "./load.js"

describe("loadAvroTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()

      DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      }).writeAvro(path)

      const table = await loadAvroTable({ path })

      expect((await table.collect()).toRecords()).toEqual([
        { id: "1", name: "english" },
        { id: "2", name: "中文" },
      ])
    })
  })
})
