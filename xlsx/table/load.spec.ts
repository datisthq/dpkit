import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadXlsxTable } from "./load.ts"
import { writeTestData } from "./test.ts"

useRecording()

const row1 = ["id", "name"]
const row2 = [1, "english"]
const row3 = [2, "中文"]

const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("loadXlsxTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const table = await loadXlsxTable({ path })
      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should load local file (multipart)", async () => {
      const path1 = getTempFilePath()
      const path2 = getTempFilePath()
      await writeTestData(path1, [row1, row2, row3])
      await writeTestData(path2, [row1, row2, row3])

      const table = await loadXlsxTable({ path: [path1, path2] })
      expect((await table.collect()).toRecords()).toEqual([
        record1,
        record2,
        record1,
        record2,
      ])
    })

    // TODO: rebase on own remote fixture
    it("should load remote file", async () => {
      const table = await loadXlsxTable({
        path: "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.xlsx",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })

    // TODO: rebase on own remote fixture
    it("should load multipart remote file", async () => {
      const table = await loadXlsxTable({
        path: [
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.xlsx",
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.xlsx",
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

  describe("dialect variations", () => {
    it("should support sheetNumber", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3], { sheetNumber: 2 })

      const table = await loadXlsxTable({
        path,
        dialect: { sheetNumber: 2 },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should support sheetName", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3], { sheetName: "Sheet2" })

      const table = await loadXlsxTable({
        path,
        dialect: { sheetName: "Sheet2" },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should support no header", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row2, row3])

      const table = await loadXlsxTable({
        path,
        dialect: { header: false },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { field1: 1, field2: "english" },
        { field1: 2, field2: "中文" },
      ])
    })

    it("should support headerRows offset", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const table = await loadXlsxTable({
        path,
        dialect: { headerRows: [2] },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { 1: 2, english: "中文" },
      ])
    })

    it("should support multiline headerRows", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const table = await loadXlsxTable({
        path,
        dialect: { headerRows: [1, 2] },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { "id 1": 2, "name english": "中文" },
      ])
    })

    it("should support headerJoin", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const table = await loadXlsxTable({
        path,
        dialect: { headerRows: [1, 2], headerJoin: "-" },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { "id-1": 2, "name-english": "中文" },
      ])
    })

    it("should support commentRows", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const table = await loadXlsxTable({
        path,
        dialect: { commentRows: [2] },
      })

      expect((await table.collect()).toRecords()).toEqual([record2])
    })

    it("should support commentChar", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3, ["#comment"]])

      const table = await loadXlsxTable({
        path,
        dialect: { commentChar: "#" },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should handle longer rows", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3, [3, "german", "bad"]])

      const table = await loadXlsxTable({
        path,
        dialect: { commentChar: "#" },
      })

      expect((await table.collect()).toRecords()).toEqual([
        record1,
        record2,
        { id: 3, name: "german" },
      ])
    })

    it("should handle shorter rows", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3, [3]])

      const table = await loadXlsxTable({
        path,
        dialect: { commentChar: "#" },
      })

      expect((await table.collect()).toRecords()).toEqual([
        record1,
        record2,
        { id: 3, name: null },
      ])
    })
  })
})
