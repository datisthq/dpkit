import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadDatabaseTable, saveDatabaseTable } from "../table/index.ts"

useRecording()

const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("SqliteDriver", () => {
  it("should save/load table", async () => {
    const path = getTempFilePath()

    const source = pl.DataFrame([record1, record2]).lazy()
    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const table = await loadDatabaseTable({ path, dialect, format: "sqlite" })

    expect((await table.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with protocol", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = pl.DataFrame([record1, record2]).lazy()
    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const table = await loadDatabaseTable({ path, dialect, format: "sqlite" })

    expect((await table.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with various data types", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = pl
      .DataFrame([
        pl.Series("string", ["string"], pl.Utf8),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
        pl.Series("boolean", [true], pl.Bool),
        //pl.Series("object", [{ value: 1 }], pl.Struct([pl.Field("value", pl.Int32)])),
        pl.Series("array", [[1, 2, 3]], pl.List(pl.Int32)),
        pl.Series("list", [[1, 2, 3]], pl.List(pl.Int32)),
        pl.Series("datetime", [new Date(Date.UTC(2025, 0, 1))], pl.Datetime),
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.Date),
        //pl.Series("time", [new Date(Date.UTC(2025, 0, 1))], pl.Time),
      ])
      .lazy()

    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const table = await loadDatabaseTable(
      { path, dialect, format: "sqlite" },
      { denormalized: true },
    )

    expect((await table.collect()).toRecords()).toEqual([
      {
        string: "string",
        integer: 1,
        number: 1.1,
        boolean: "true",
        //object: '{"value":1}',
        array: "[1,2,3]",
        list: "[1,2,3]",
        datetime: "2025-01-01T00:00:00.000Z",
        date: "2025-01-01",
        //time: "00:00:00.000Z",
      },
    ])
  })
})
