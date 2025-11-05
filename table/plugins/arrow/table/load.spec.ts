import { getTempFilePath } from "@dpkit/file"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { useRecording } from "vitest-polly"
import { loadArrowTable } from "./load.ts"

useRecording()

describe("loadArrowTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()
      pl.DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeIPC(path)

      const table = await loadArrowTable({ path })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load local file (multipart)", async () => {
      const path1 = getTempFilePath()
      const path2 = getTempFilePath()
      pl.DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeIPC(path1)
      pl.DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeIPC(path2)

      const table = await loadArrowTable({ path: [path1, path2] })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load remote file", async () => {
      const table = await loadArrowTable({
        path: "https://raw.githubusercontent.com/datisthq/dpkit/refs/heads/main/arrow/table/fixtures/table.arrow",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load remote file (multipart)", async () => {
      const table = await loadArrowTable({
        path: [
          "https://raw.githubusercontent.com/datisthq/dpkit/refs/heads/main/arrow/table/fixtures/table.arrow",
          "https://raw.githubusercontent.com/datisthq/dpkit/refs/heads/main/arrow/table/fixtures/table.arrow",
        ],
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })
  })
})
