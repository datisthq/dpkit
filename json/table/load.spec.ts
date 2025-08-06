import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadJsonlTable } from "./load.js"

describe("loadJsonlTable", () => {
  useRecording()

  describe("file variations", () => {
    it("should load local file", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path = await writeTempFile(body)

      const table = await loadJsonlTable({ path })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load local file (multipart)", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path1 = await writeTempFile(body)
      const path2 = await writeTempFile(body)

      const table = await loadJsonlTable({ path: [path1, path2] })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load remote file", async () => {
      const table = await loadJsonlTable({
        path: "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })

    it("should load remote file (multipart)", async () => {
      const table = await loadJsonlTable({
        path: [
          "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
          "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
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
