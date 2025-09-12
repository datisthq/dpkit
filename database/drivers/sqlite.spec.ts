import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { createDriver } from "../drivers/create.ts"
import { loadPackageFromDatabase } from "../package/index.ts"
import { inferDatabaseSchema } from "../schema/index.ts"
import { loadDatabaseTable, saveDatabaseTable } from "../table/index.ts"

useRecording()

const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("SqliteDriver", () => {
  it("should infer schema", async () => {
    const path = getTempFilePath()

    const source = DataFrame([
      Series("string", ["string"], DataType.Utf8),
      Series("integer", [1], DataType.Int32),
      Series("number", [1.1], DataType.Float64),
    ]).lazy()

    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const schema = await inferDatabaseSchema({
      path,
      dialect,
      format: "sqlite",
    })

    expect(schema).toEqual({
      fields: [
        { name: "string", type: "string" },
        { name: "integer", type: "integer" },
        { name: "number", type: "number" },
      ],
    })
  })

  it("should save/load table", async () => {
    const path = getTempFilePath()

    const source = DataFrame([record1, record2]).lazy()
    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const target = await loadDatabaseTable({ path, dialect, format: "sqlite" })

    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with protocol", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = DataFrame([record1, record2]).lazy()
    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const target = await loadDatabaseTable({ path, dialect, format: "sqlite" })

    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with various data types", async () => {
    const path = `sqlite://${getTempFilePath()}`

    const source = DataFrame([
      //Series("array", [[1, 2, 3]], List(Int32)),
      Series("array", ["[1, 2, 3]"], DataType.String),
      Series("boolean", [true], DataType.Bool),
      Series("date", [new Date(Date.UTC(2025, 0, 1))], DataType.Date),
      Series("datetime", [new Date(Date.UTC(2025, 0, 1))], DataType.Datetime),
      Series("duration", ["P23DT23H"], DataType.String),
      Series("geojson", ['{"value": 1}'], DataType.String),
      Series("geopoint", [[40.0, 50.0]], DataType.List(DataType.Float32)),
      Series("integer", [1], DataType.Int32),
      Series("list", [[1.0, 2.0, 3.0]], DataType.List(DataType.Float32)),
      Series("number", [1.1], DataType.Float64),
      Series("object", ['{"value": 1}']),
      Series("string", ["string"], DataType.String),
      Series("time", [new Date(Date.UTC(2025, 0, 1))], DataType.Time),
      Series("year", [2025], DataType.Int32),
      Series("yearmonth", [[2025, 1]], DataType.List(DataType.Int16)),
    ]).lazy()

    await saveDatabaseTable(source, {
      path,
      dialect,
      format: "sqlite",
      fieldTypes: {
        geojson: "geojson",
        geopoint: "geopoint",
        list: "list",
        object: "object",
        // TODO: Remove time after:
        // https://github.com/pola-rs/nodejs-polars/issues/364
        time: "time",
        year: "year",
        yearmonth: "yearmonth",
      },
    })

    const target = await loadDatabaseTable(
      { path, dialect, format: "sqlite" },
      { denormalized: true },
    )

    expect((await target.collect()).toRecords()).toEqual([
      {
        array: "[1, 2, 3]",
        boolean: "true",
        date: "2025-01-01",
        datetime: "2025-01-01T00:00:00",
        duration: "P23DT23H",
        geojson: '{"value": 1}',
        geopoint: "40.0,50.0",
        integer: 1,
        list: "1.0,2.0,3.0",
        number: 1.1,
        object: '{"value": 1}',
        string: "string",
        time: "00:00:00",
        year: 2025,
        yearmonth: "2025-01",
      },
    ])
  })

  it("should load package from database", async () => {
    const path = getTempFilePath()
    const driver = createDriver("sqlite")
    const database = await driver.connectDatabase(path)
  })
})
