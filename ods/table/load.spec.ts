import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadOdsTable } from "./load.ts"
import { writeTestData } from "./test.ts"

useRecording()

const row1 = ["id", "name"]
const row2 = [1, "english"]
const row3 = [2, "中文"]

const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("loadOdsTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const { table } = await loadOdsTable({ path })
      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should load local file (multipart)", async () => {
      const path1 = getTempFilePath()
      const path2 = getTempFilePath()
      await writeTestData(path1, [row1, row2, row3])
      await writeTestData(path2, [row1, row2, row3])

      const { table } = await loadOdsTable({ path: [path1, path2] })
      expect((await table.collect()).toRecords()).toEqual([
        record1,
        record2,
        record1,
        record2,
      ])
    })

    // TODO: rebase on own remote fixture
    it("should load remote file", async () => {
      const { table } = await loadOdsTable({
        path: "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.ods",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: 1, name: "english" },
        { id: 2, name: "中国人" },
      ])
    })

    // TODO: rebase on own remote fixture
    it("should load multipart remote file", async () => {
      const { table } = await loadOdsTable({
        path: [
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.ods",
          "https://github.com/frictionlessdata/frictionless-py/raw/refs/heads/main/data/table.ods",
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

      const { table } = await loadOdsTable({
        path,
        dialect: { sheetNumber: 2 },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should support sheetName", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3], { sheetName: "Sheet2" })

      const { table } = await loadOdsTable({
        path,
        dialect: { sheetName: "Sheet2" },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should support no header", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row2, row3])

      const { table } = await loadOdsTable({
        path,
        dialect: { header: false },
      })

      expect((await table.collect()).toRecords()).toEqual([
        { column_1: 1, column_2: "english" },
        { column_1: 2, column_2: "中文" },
      ])
    })

    it("should support headerRows offset", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3])

      const { table } = await loadOdsTable({
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

      const { table } = await loadOdsTable({
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

      const { table } = await loadOdsTable({
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

      const { table } = await loadOdsTable({
        path,
        dialect: { commentRows: [2] },
      })

      expect((await table.collect()).toRecords()).toEqual([record2])
    })

    it("should support commentChar", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3, ["#comment"]])

      const { table } = await loadOdsTable({
        path,
        dialect: { commentChar: "#" },
      })

      expect((await table.collect()).toRecords()).toEqual([record1, record2])
    })

    it("should handle longer rows", async () => {
      const path = getTempFilePath()
      await writeTestData(path, [row1, row2, row3, [3, "german", "bad"]])

      const { table } = await loadOdsTable({
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

      const { table } = await loadOdsTable({
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
