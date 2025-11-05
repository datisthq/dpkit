import { getTempFilePath } from "@dpkit/file"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadArrowTable } from "./load.ts"
import { saveArrowTable } from "./save.ts"

describe("saveArrowTable", () => {
  it("should save table to Arrow file", async () => {
    const path = getTempFilePath()
    const source = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveArrowTable(source, { path })

    const table = await loadArrowTable({ path })
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
        pl.Series("array", ["[1, 2, 3]"], pl.String),
        pl.Series("boolean", [true], pl.Bool),
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.Date),
        pl.Series("datetime", [new Date(Date.UTC(2025, 0, 1))], pl.Datetime),
        pl.Series("duration", ["P23DT23H"], pl.String),
        pl.Series("geojson", ['{"value": 1}'], pl.String),
        pl.Series("geopoint", [[40.0, 50.0]], pl.List(pl.Float32)),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("list", [[1.0, 2.0, 3.0]], pl.List(pl.Float32)),
        pl.Series("number", [1.1], pl.Float64),
        pl.Series("object", ['{"value": 1}']),
        pl.Series("string", ["string"], pl.String),
        pl.Series("time", [new Date(Date.UTC(2025, 0, 1))], pl.Time),
        pl.Series("year", [2025], pl.Int32),
        pl.Series("yearmonth", [[2025, 1]], pl.List(pl.Int16)),
      ])
      .lazy()

    await saveArrowTable(source, {
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

    const target = await loadArrowTable({ path }, { denormalized: true })
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
