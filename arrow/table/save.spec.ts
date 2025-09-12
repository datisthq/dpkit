import { getTempFilePath } from "@dpkit/file"
import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadArrowTable } from "./load.ts"
import { saveArrowTable } from "./save.ts"

describe("saveArrowTable", () => {
  it("should save table to Arrow file", async () => {
    const path = getTempFilePath()
    const source = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

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

    const source = DataFrame([
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
