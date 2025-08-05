import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { loadArrowTable } from "./load.js"
import { saveArrowTable } from "./save.js"

describe("saveArrowTable", () => {
  it("should save table to Arrow file", async () => {
    await temporaryFileTask(async path => {
      const source = DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      }).lazy()

      await saveArrowTable(source, { path })

      const target = await loadArrowTable({ path })
      expect((await target.collect()).toRecords()).toEqual([
        { id: 1.0, name: "Alice" },
        { id: 2.0, name: "Bob" },
        { id: 3.0, name: "Charlie" },
      ])
    })
  })
})
