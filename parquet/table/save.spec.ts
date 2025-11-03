import { getTempFilePath } from "@dpkit/file"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadParquetTable } from "./load.ts"
import { saveParquetTable } from "./save.ts"

describe("saveParquetTable", () => {
  it("should save table to Parquet file", async () => {
    const path = getTempFilePath()
    const source = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveParquetTable(source, { path })

    const table = await loadParquetTable({ path })
    expect((await table.collect()).toRecords()).toEqual([
      { id: 1.0, name: "Alice" },
      { id: 2.0, name: "Bob" },
      { id: 3.0, name: "Charlie" },
    ])
  })

  it("should save and load various data types", async () => {
    const path = getTempFilePath()

    const source = pl
      .DataFrame([
        pl.Series("array", ["[1, 2, 3]"], pl.DataType.String),
        pl.Series("boolean", [true], pl.DataType.Bool),
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.DataType.Date),
        pl.Series(
          "datetime",
          [new Date(Date.UTC(2025, 0, 1))],
          pl.DataType.Datetime,
        ),
        pl.Series("duration", ["P23DT23H"], pl.DataType.String),
        pl.Series("geojson", ['{"value": 1}'], pl.DataType.String),
        pl.Series(
          "geopoint",
          [[40.0, 50.0]],
          pl.DataType.List(pl.DataType.Float32),
        ),
        pl.Series("integer", [1], pl.DataType.Int32),
        pl.Series(
          "list",
          [[1.0, 2.0, 3.0]],
          pl.DataType.List(pl.DataType.Float32),
        ),
        pl.Series("number", [1.1], pl.DataType.Float64),
        pl.Series("object", ['{"value": 1}']),
        pl.Series("string", ["string"], pl.DataType.String),
        pl.Series("time", [new Date(Date.UTC(2025, 0, 1))], pl.DataType.Time),
        pl.Series("year", [2025], pl.DataType.Int32),
        pl.Series(
          "yearmonth",
          [[2025, 1]],
          pl.DataType.List(pl.DataType.Int16),
        ),
      ])
      .lazy()

    await saveParquetTable(source, {
      path,
      fieldTypes: {
        array: "array",
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

    const target = await loadParquetTable({ path }, { denormalized: true })
    expect((await target.collect()).toRecords()).toEqual([
      {
        array: "[1, 2, 3]",
        boolean: true,
        date: "2025-01-01",
        datetime: new Date(Date.UTC(2025, 0, 1)),
        duration: "P23DT23H",
        geojson: '{"value": 1}',
        geopoint: "40.0,50.0",
        integer: 1,
        list: [1.0, 2.0, 3.0],
        number: 1.1,
        object: '{"value": 1}',
        string: "string",
        time: "00:00:00",
        year: 2025,
        yearmonth: "2025-01",
      },
    ])
  })
})
