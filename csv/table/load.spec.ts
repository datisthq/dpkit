import { temporaryWriteTask } from "tempy"
import { describe, expect, it } from "vitest"
import { loadCsvTable } from "./load.js"

describe("loadCsvTable", () => {
  describe("file variations", () => {
    it("should load local file", async () => {
      await temporaryWriteTask("id,name\n1,english\n2,中文", async path => {
        const table = await loadCsvTable({ path })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "english" },
          { id: "2", name: "中文" },
        ])
      })
    })

    it.only("should load local multipart file", async () => {
      temporaryWriteTask("id,name\n1,english", async path1 => {
        await temporaryWriteTask("2,中文\n3,german", async path2 => {
          const table = await loadCsvTable({ path: [path1, path2] })

          expect((await table.collect()).toRecords()).toEqual([
            { id: "1", name: "english" },
            { id: "2", name: "中文" },
            { id: "3", name: "german" },
          ])
        })
      })
    })

    it("should load remote file", async () => {
      const table = await loadCsvTable({
        path: "https://raw.githubusercontent.com/datisthq/dpkit/refs/heads/main/core/package/fixtures/table.csv",
      })

      expect((await table.collect()).toRecords()).toEqual([
        { id: "1", name: "english" },
        { id: "2", name: "中国人" },
      ])
    })
  })

  describe("dialect variations", () => {
    it("should handle custom delimiter", async () => {
      await temporaryWriteTask("id|name\n1|alice\n2|bob", async path => {
        const table = await loadCsvTable({
          path,
          dialect: { delimiter: "|" },
        })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "alice" },
          { id: "2", name: "bob" },
        ])
      })
    })

    it("should handle files without header", async () => {
      await temporaryWriteTask("1,alice\n2,bob", async path => {
        const table = await loadCsvTable({
          path,
          dialect: { header: false },
        })

        const records = (await table.collect()).toRecords()
        expect(records).toEqual([
          { column_1: "1", column_2: "alice" },
          { column_1: "2", column_2: "bob" },
        ])
      })
    })

    // TODO: it dons't work; polars bug?
    it.skip("should handle custom line terminator", async () => {
      await temporaryWriteTask("id,name|1,alice|2,bob", async path => {
        const table = await loadCsvTable({
          path,
          dialect: { lineTerminator: "|" },
        })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "alice" },
          { id: "2", name: "bob" },
        ])
      })
    })

    it("should handle custom quote character", async () => {
      await temporaryWriteTask(
        "id,name\n1,'alice smith'\n2,'bob jones'",
        async path => {
          const table = await loadCsvTable({
            path,
            dialect: { quoteChar: "'" },
          })

          expect((await table.collect()).toRecords()).toEqual([
            { id: "1", name: "alice smith" },
            { id: "2", name: "bob jones" },
          ])
        },
      )
    })

    it.skip("should handle comment character", async () => {
      await temporaryWriteTask(
        "# This is a comment\nid,name\n1,alice\n# Another comment\n2,bob",
        async path => {
          const table = await loadCsvTable({
            path,
            dialect: { commentChar: "#" },
          })

          const records = (await table.collect()).toRecords()
          expect(records).toEqual([
            { id: "1", name: "alice" },
            { id: "2", name: "bob" },
          ])
        },
      )
    })

    it("should handle multiple dialect options together", async () => {
      await temporaryWriteTask(
        "id|'full name'|age\r\n1|'alice smith'|25\r\n2|'bob jones'|30",
        async path => {
          const table = await loadCsvTable({
            path,
            dialect: {
              delimiter: "|",
              quoteChar: "'",
              //lineTerminator: "\r\n",
              //commentChar: "#",
              header: true,
            },
          })

          expect((await table.collect()).toRecords()).toEqual([
            { id: "1", "full name": "alice smith", age: "25" },
            { id: "2", "full name": "bob jones", age: "30" },
          ])
        },
      )
    })

    it("should handle utf8 encoding", async () => {
      const content = Buffer.from("id,name\n1,café\n2,naïve", "utf8")
      await temporaryWriteTask(content, async path => {
        const table = await loadCsvTable({
          path,
          encoding: "utf8",
        })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "café" },
          { id: "2", name: "naïve" },
        ])
      })
    })

    // TODO: currently not supported by nodejs-polars
    it.skip("should handle utf16 encoding", async () => {
      const content = Buffer.from("id,name\n1,café\n2,naïve", "utf16le")
      await temporaryWriteTask(content, async path => {
        const table = await loadCsvTable({
          path,
          encoding: "utf16",
        })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "café" },
          { id: "2", name: "naïve" },
        ])
      })
    })

    // TODO: currently not supported by nodejs-polars
    it.skip("should handle latin1 encoding", async () => {
      const content = Buffer.from("id,name\n1,café\n2,résumé", "latin1")
      await temporaryWriteTask(content, async path => {
        const table = await loadCsvTable({
          path,
          encoding: "latin1",
        })

        expect((await table.collect()).toRecords()).toEqual([
          { id: "1", name: "café" },
          { id: "2", name: "résumé" },
        ])
      })
    })
  })
})
