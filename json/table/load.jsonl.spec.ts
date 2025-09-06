import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadJsonTable } from "./load.ts"

describe("loadJsonTable", () => {
  useRecording()

  describe("file variations", () => {
    it("should load local file", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path = await writeTempFile(body)

      const table = await loadJsonTable({ path, format: "jsonl" })
      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load local file (multipart)", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path1 = await writeTempFile(body)
      const path2 = await writeTempFile(body)

      const table = await loadJsonTable({
        path: [path1, path2],
        format: "jsonl",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load remote file", async () => {
      const table = await loadJsonTable({
        path: "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
        format: "jsonl",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })

    it("should load remote file (multipart)", async () => {
      const table = await loadJsonTable({
        path: [
          "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
          "https://raw.githubusercontent.com/frictionlessdata/frictionless-py/refs/heads/main/data/table.jsonl",
        ],
        format: "jsonl",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })
  })

  describe("dialect variations", () => {
    it("should handle item keys", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path = await writeTempFile(body)

      const table = await loadJsonTable({
        path,
        format: "jsonl",
        dialect: { itemKeys: ["name"] },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { name: "english" },
        { name: "中文" },
      ])
    })

    it("should handle item type (array)", async () => {
      const body = '["id","name"]\n[1,"english"]\n[2,"中文"]'
      const path = await writeTempFile(body)

      const table = await loadJsonTable({
        path,
        format: "jsonl",
        dialect: { itemType: "array" },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })

    it("should load item type (object)", async () => {
      const body = '{"id":1,"name":"english"}\n{"id":2,"name":"中文"}'
      const path = await writeTempFile(body)

      const table = await loadJsonTable({
        path,
        format: "jsonl",
        dialect: { itemType: "object" },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ])
    })
  })
})
