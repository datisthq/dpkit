import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { loadAvroTable } from "./load.js"

describe("loadAvroTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      await temporaryFileTask(
        async path => {
          const table = await loadAvroTable({ path })

          expect(table).toBeDefined()
        },
        { extension: "avro" },
      )
    })
  })
})
