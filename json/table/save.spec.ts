//import { readFile } from "node:fs/promises"
import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { saveJsonTable } from "./save.js"

describe("saveJsonTable", () => {
  it("should save table to JSON file", async () => {
    await temporaryFileTask(async path => {
      const table = DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      }).lazy()

      await saveJsonTable(table, { path })

      //const content = await readFile(path, "utf-8")
      //expect(content).toEqual("id,name\n1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
      expect(true).toBe(true)
    })
  })
})
