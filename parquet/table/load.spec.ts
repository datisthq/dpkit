import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadParquetTable } from "./load.ts"

useRecording()

describe("loadParquetTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()
      DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeParquet(path)

      const table = await loadParquetTable({ path })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load local file (multipart)", async () => {
      const path1 = getTempFilePath()
      const path2 = getTempFilePath()
      DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeParquet(path1)
      DataFrame({ id: [1, 2], name: ["english", "中文"] }).writeParquet(path2)

      const table = await loadParquetTable({ path: [path1, path2] })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load remote file", async () => {
      const table = await loadParquetTable({
        path: "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.parquet",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })

    it("should load remote file (multipart)", async () => {
      const table = await loadParquetTable({
        path: [
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.parquet",
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.parquet",
        ],
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })
  })
})
