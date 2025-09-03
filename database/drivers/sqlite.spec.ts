import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadSqliteTable, saveSqliteTable } from "../table/index.ts"

useRecording()

const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("SqliteDriver", () => {
  it("should save/load table", async () => {
    const path = getTempFilePath()

    const source = DataFrame([record1, record2]).lazy()
    await saveSqliteTable(source, { path, dialect })
    const target = await loadSqliteTable({ path, dialect })

    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with protocol", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = DataFrame([record1, record2]).lazy()
    await saveSqliteTable(source, { path, dialect })
    const target = await loadSqliteTable({ path, dialect })

    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })
})
