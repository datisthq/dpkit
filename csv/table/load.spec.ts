import { Buffer } from "node:buffer"
import { writeTempFile } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { describe, expect, it } from "vitest"
import { loadCsvTable } from "./load.ts"

useRecording()

describe("loadCsvTable", () => {
  it("should load local file", async () => {
    const path = await writeTempFile("id,name\n1,english\n2,中文")
    const table = await loadCsvTable({ path })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ])
  })

  it("should load local file (multipart)", async () => {
    const path1 = await writeTempFile("id,name\n1,english")
    const path2 = await writeTempFile("2,中文\n3,german")

    const table = await loadCsvTable({ path: [path1, path2] })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
      { id: 3, name: "german" },
    ])
  })

  it("should load remote file", async () => {
    const table = await loadCsvTable({
      path: "https://raw.githubusercontent.com/datisthq/dpkit/refs/heads/main/core/package/fixtures/table.csv",
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中国人" },
    ])
  })

  it("should load remote file (multipart)", async () => {
    const table = await loadCsvTable({
      path: [
        "https://gist.githubusercontent.com/roll/d20416f5e6dfc3fc1a7c4eef8452d581/raw/1c9cd1a020389921bf83e5a0395bb00c6b27402d/tabl1.csv",
        "https://gist.githubusercontent.com/roll/ba1c358f1daa994f8094633669d60f50/raw/03e0e54f9d4df7ff08b0d0db937fe5d720d8dfe6/table2.csv",
      ],
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中国人" },
      { id: 3, name: "german" },
    ])
  })

  it("should handle windows line terminator by default", async () => {
    const path = await writeTempFile("id,name\r\n1,english\r\n2,中文")
    const table = await loadCsvTable({ path })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ])
  })

  it("should handle custom delimiter", async () => {
    const path = await writeTempFile("id|name\n1|alice\n2|bob")
    const table = await loadCsvTable({
      path,
      dialect: { delimiter: "|" },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should handle files without header", async () => {
    const path = await writeTempFile("1,alice\n2,bob")
    const table = await loadCsvTable({
      path,
      dialect: { header: false },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { column_1: 1, column_2: "alice" },
      { column_1: 2, column_2: "bob" },
    ])
  })

  it.skip("should handle custom line terminator", async () => {
    const path = await writeTempFile("id,name|1,alice|2,bob")
    const table = await loadCsvTable({
      path,
      dialect: { lineTerminator: "|" },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it.skip("should handle escape char", async () => {
    const path = await writeTempFile(
      "id,name\n1,apple|,fruits\n2,orange|,fruits",
    )

    const table = await loadCsvTable({
      path,
      dialect: { escapeChar: "|" },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "apple,fruits" },
      { id: 2, name: "orange,fruits" },
    ])
  })

  it("should handle custom quote character", async () => {
    const path = await writeTempFile("id,name\n1,'alice smith'\n2,'bob jones'")

    const table = await loadCsvTable({
      path,
      dialect: { quoteChar: "'" },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alice smith" },
      { id: 2, name: "bob jones" },
    ])
  })

  it("should handle double quote by default", async () => {
    const path = await writeTempFile(
      'id,name\n1,"alice""smith"\n2,"bob""jones"',
    )

    const table = await loadCsvTable({
      path,
      dialect: { doubleQuote: true },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: 'alice"smith' },
      { id: 2, name: 'bob"jones' },
    ])
  })

  it.skip("should handle disabling double quote", async () => {
    const path = await writeTempFile(
      'id,name\n1,"alice""smith"\n2,"bob""jones"',
    )

    const table = await loadCsvTable({
      path,
      dialect: { doubleQuote: false },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alicesmith" },
      { id: 2, name: "bobjones" },
    ])
  })

  it("should handle comment character", async () => {
    const path = await writeTempFile(
      "# This is a comment\nid,name\n1,alice\n# Another comment\n2,bob",
    )

    const table = await loadCsvTable({
      path,
      dialect: { commentChar: "#" },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should support headerRows", async () => {
    const path = await writeTempFile("#comment\nid,name\n1,alice\n2,bob")

    const table = await loadCsvTable({
      path,
      dialect: { headerRows: [2] },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should support headerJoin", async () => {
    const path = await writeTempFile(
      "#comment\nid,name\nint,str\n1,alice\n2,bob",
    )

    const table = await loadCsvTable({
      path,
      dialect: { headerRows: [2, 3], headerJoin: "_" },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id_int: 1, name_str: "alice" },
      { id_int: 2, name_str: "bob" },
    ])
  })

  it("should support commentRows", async () => {
    const path = await writeTempFile("id,name\n1,alice\ncomment\n2,bob")

    const table = await loadCsvTable({
      path,
      dialect: { commentRows: [3] },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should support headerRows and commentRows", async () => {
    const path = await writeTempFile(
      "#comment\nid,name\n1,alice\n#comment\n2,bob",
    )

    const table = await loadCsvTable({
      path,
      dialect: { headerRows: [2], commentRows: [4] },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id: 1, name: "alice" },
      { id: 2, name: "bob" },
    ])
  })

  it("should support headerJoin and commentRows", async () => {
    const path = await writeTempFile(
      "#comment\nid,name\nint,str\n1,alice\n#comment\n2,bob",
    )

    const table = await loadCsvTable({
      path,
      dialect: { headerRows: [2, 3], headerJoin: "_", commentRows: [5] },
    })

    const records = (await table.collect()).toRecords()
    expect(records).toEqual([
      { id_int: 1, name_str: "alice" },
      { id_int: 2, name_str: "bob" },
    ])
  })

  it("should handle null sequence", async () => {
    const path = await writeTempFile(
      "id,name,age\n1,alice,25\n2,N/A,30\n3,bob,N/A",
    )
    const table = await loadCsvTable({
      path,
      dialect: { nullSequence: "N/A" },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alice", age: 25 },
      { id: 2, name: null, age: 30 },
      { id: 3, name: "bob", age: null },
    ])
  })

  it("should handle skip initial space", async () => {
    const path = await writeTempFile(
      "id,name,category\n1, alice, fruits\n2,  bob,  vegetables\n3,charlie,grains",
    )
    const table = await loadCsvTable({
      path,
      dialect: { skipInitialSpace: true },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "alice", category: "fruits" },
      { id: 2, name: "bob", category: "vegetables" },
      { id: 3, name: "charlie", category: "grains" },
    ])
  })

  it("should handle multiple dialect options together", async () => {
    const path = await writeTempFile(
      "#comment\nid|'full name'|age\n1|'alice smith'|25\n2|'bob jones'|30",
    )
    const table = await loadCsvTable({
      path,
      dialect: {
        delimiter: "|",
        quoteChar: "'",
        commentChar: "#",
        header: true,
      },
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, "full name": "alice smith", age: 25 },
      { id: 2, "full name": "bob jones", age: 30 },
    ])
  })

  it("should handle utf8 encoding", async () => {
    const path = await writeTempFile(
      Buffer.from("id,name\n1,café\n2,naïve", "utf8"),
    )

    const table = await loadCsvTable({
      path,
      encoding: "utf8",
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "café" },
      { id: 2, name: "naïve" },
    ])
  })

  // TODO: currently not supported by nodejs-polars
  it.skip("should handle utf16 encoding", async () => {
    const path = await writeTempFile(
      Buffer.from("id,name\n1,café\n2,naïve", "utf16le"),
    )

    const table = await loadCsvTable({
      path,
      encoding: "utf16",
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "café" },
      { id: 2, name: "naïve" },
    ])
  })

  // TODO: currently not supported by nodejs-polars
  it.skip("should handle latin1 encoding", async () => {
    const path = await writeTempFile(
      Buffer.from("id,name\n1,café\n2,résumé", "latin1"),
    )

    const table = await loadCsvTable({
      path,
      encoding: "latin1",
    })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "café" },
      { id: 2, name: "résumé" },
    ])
  })
})

describe("loadCsvTable (format=tsv)", () => {
  it("should load local file", async () => {
    const path = await writeTempFile("id\tname\n1\tenglish\n2\t中文")
    const table = await loadCsvTable({ path, format: "tsv" })

    expect((await table.collect()).toRecords()).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ])
  })
})
