import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { saveArrowTable } from "./save.js"

describe("saveArrowTable", () => {
  it("should save table to Arrow file", async () => {
    await temporaryFileTask(async path => {
      const table = DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      }).lazy()

      await saveArrowTable(table, { path })

      expect(true).toBe(true)
    })
  })
})
