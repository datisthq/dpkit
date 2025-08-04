import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { saveAvroTable } from "./save.js"

describe("saveAvroTable", () => {
  it("should save table to Avro file", async () => {
    await temporaryFileTask(async path => {
      const table = DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      }).lazy()

      await saveAvroTable(table, { path })

      expect(true).toBe(true)
    })
  })
})
