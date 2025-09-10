import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadCsvTable } from "./load.ts"
import { saveCsvTable } from "./save.ts"

describe("saveCsvTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id,name\n1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom delimiter", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { delimiter: ";" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id;name\n1.0;Alice\n2.0;Bob\n3.0;Charlie\n")
  })

  it("should save without header", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { header: false },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom quote char", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice,Smith", "Bob,Jones", "Charlie,Brown"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { quoteChar: "'" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      "id,name\n1.0,'Alice,Smith'\n2.0,'Bob,Jones'\n3.0,'Charlie,Brown'\n",
    )
  })

  it("should save and load various data types", async () => {
    const path = getTempFilePath()

    const source = DataFrame([
      Series("string", ["string"], DataType.String),
      Series("integer", [1], DataType.Int32),
      Series("number", [1.1], DataType.Float64),
      Series("boolean", [true], DataType.Bool),
      Series("object", ['{"value": 1}']),
      //Series("array", [[1, 2, 3]], List(Int32)),
      //Series("list", [[1, 2, 3]], List(Int32)),
      Series("datetime", [new Date(Date.UTC(2025, 0, 1))], DataType.Datetime),
      Series("date", [new Date(Date.UTC(2025, 0, 1))], DataType.Date),
      Series("time", [new Date(Date.UTC(2025, 0, 1))], DataType.Time),
      Series("year", [2025], DataType.Int32),
      Series("yearmonth", [[2025, 1]], DataType.List(DataType.Int16)),
      Series("duration", ["P23DT23H"], DataType.String),
      Series("geopoint", [[40.0, 50.0]], DataType.List(DataType.Float32)),
      Series("geojson", ['{"value": 1}'], DataType.String),
    ]).lazy()

    await saveCsvTable(source, {
      path,
      fieldTypes: {
        object: "object",
        yearmonth: "yearmonth",
        geopoint: "geopoint",
        geojson: "geojson",
      },
    })

    const target = await loadCsvTable({ path }, { denormalized: true })
    expect((await target.collect()).toRecords()).toEqual([
      {
        string: "string",
        integer: "1",
        number: "1.1",
        boolean: "true",
        object: '{"value": 1}',
        //array: "[1,2,3]",
        //list: "[1,2,3]",
        datetime: "2025-01-01T00:00:00",
        date: "2025-01-01",
        time: "2025-01-01T00:00:00",
        year: "2025",
        yearmonth: "2025-01",
        duration: "P23DT23H",
        geopoint: "40.0,50.0",
        geojson: '{"value": 1}',
      },
    ])
  })
})

describe("saveCsvTable (format=tsv)", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, { path, format: "tsv" })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id\tname\n1.0\tAlice\n2.0\tBob\n3.0\tCharlie\n")
  })
})
