import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadSqliteTable } from "./load.ts"
import { writeTestData } from "./test.ts"

useRecording()

const row1 = ["id", "name"]
const row2 = [1, "english"]
const row3 = [2, "中文"]

const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("loadSqliteTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3], { tableName: "test" })

      const table = await loadSqliteTable({ path: `sqlite://${path}` })
      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })
  })
})
