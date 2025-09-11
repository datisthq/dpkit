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
      Series("string", ["string"], DataType.String),
      Series("integer", [1], DataType.Int32),
      Series("number", [1.1], DataType.Float64),
      Series("boolean", [true], DataType.Bool),
      Series("datetime", [new Date(Date.UTC(2025, 0, 1))], DataType.Datetime),
      Series("date", [new Date(Date.UTC(2025, 0, 1))], DataType.Date),
      Series("time", [new Date(Date.UTC(2025, 0, 1))], DataType.Time),
      //Series("year", [2025], DataType.Int32),
      //Series("object", ['{"value": 1}']),
      //Series("array", ["[1, 2, 3]"], DataType.String),
      //Series("list", [[1.0, 2.0, 3.0]], DataType.List(DataType.Int32)),
      //Series("yearmonth", [[2025, 1]], DataType.List(DataType.Int16)),
      //Series("duration", ["P23DT23H"], DataType.String),
      //Series("geopoint", [[40.0, 50.0]], DataType.List(DataType.Float32)),
      //Series("geojson", ['{"value": 1}'], DataType.String),
    ]).lazy()

    await saveArrowTable(source, {
      path,
      fieldTypes: {
        // TODO: Remove time after:
        // https://github.com/pola-rs/nodejs-polars/issues/364
        time: "time",
        year: "year",
        yearmonth: "yearmonth",
        object: "object",
        array: "array",
        list: "list",
        geopoint: "geopoint",
        geojson: "geojson",
      },
    })

    const target = await loadArrowTable({ path }, { denormalized: true })
    expect((await target.collect()).toRecords()).toEqual([
      {
        string: "string",
        integer: 1,
        number: 1.1,
        boolean: true,
        datetime: new Date(Date.UTC(2025, 0, 1)),
        date: "2025-01-01",
        time: "00:00:00",
        //year: 2025,
        //object: '{"value": 1}',
        //array: "[1, 2, 3]",
        //list: "1.0,2.0,3.0",
        //yearmonth: "2025-01",
        //duration: "P23DT23H",
        //geopoint: "40.0,50.0",
        //geojson: '{"value": 1}',
      },
    ])
  })
})
