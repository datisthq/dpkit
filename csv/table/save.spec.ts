import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveCsvTable } from "./save.ts"

describe("saveCsvTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveCsvTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id,name\n1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom delimiter", async () => {
    const path = getTempFilePath()
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveCsvTable(table, {
      path,
      dialect: { delimiter: ";" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id;name\n1.0;Alice\n2.0;Bob\n3.0;Charlie\n")
  })

  it("should save without header", async () => {
    const path = getTempFilePath()
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveCsvTable(table, {
      path,
      dialect: { header: false },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom quote char", async () => {
    const path = getTempFilePath()
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice,Smith", "Bob,Jones", "Charlie,Brown"],
      })
      .lazy()

    await saveCsvTable(table, {
      path,
      dialect: { quoteChar: "'" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      "id,name\n1.0,'Alice,Smith'\n2.0,'Bob,Jones'\n3.0,'Charlie,Brown'\n",
    )
  })

  it("should save various data types", async () => {
    const path = getTempFilePath()

    const table = pl
      .DataFrame([
        pl.Series("string", ["string"], pl.Utf8),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
        pl.Series("boolean", [true], pl.Bool),
        //pl.Series("object", [{ value: 1 }]),
        //pl.Series("array", [[1, 2, 3]], pl.List(pl.Int32)),
        //pl.Series("list", [[1, 2, 3]], pl.List(pl.Int32)),
        pl.Series("datetime", [new Date(Date.UTC(2025, 0, 1))], pl.Datetime),
        pl.Series("date", [new Date(Date.UTC(2025, 0, 1))], pl.Date),
        pl.Series("time", [new Date(Date.UTC(2025, 0, 1))], pl.Time),
        pl.Series("year", [2025], pl.Int32),
        pl.Series("yearmonth", [[2025, 1]], pl.List(pl.Int32)),
        pl.Series("duration", ["P23DT23H"], pl.Utf8),
        //pl.Series("geopoint", [[40.00, 50.00]], pl.List(pl.Float32)),
        //pl.Series("geojson", [{ value: 1 }]),
      ])
      .lazy()

    await saveCsvTable(table, {
      path,
      dialect: { delimiter: ";" },
      fieldTypes: {
        yearmonth: "yearmonth",
      },
    })

    const content = await readFile(path, "utf-8")
    const [head, body] = content.split("\n")

    const labels = head?.split(";") ?? []
    const cells = body?.split(";") ?? []

    const records = Object.fromEntries(
      labels.map((label, index) => [label, cells[index]]),
    )

    expect(records).toEqual({
      string: "string",
      integer: "1",
      number: "1.1",
      boolean: "true",
      // TODO: fix
      //object: "{\"value\":1}",
      //array: "[1,2,3]",
      //list: "[1,2,3]",
      datetime: "2025-01-01T00:00:00",
      date: "2025-01-01",
      time: "2025-01-01T00:00:00",
      year: "2025",
      yearmonth: "2025-01",
      duration: "P23DT23H",
      // geopoint: "[40.00,50.00]",
      //geojson: "{\"value\":1}",
    })
  })
})

describe("saveCsvTable (format=tsv)", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    const table = pl
      .DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      })
      .lazy()

    await saveCsvTable(table, { path, format: "tsv" })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id\tname\n1.0\tAlice\n2.0\tBob\n3.0\tCharlie\n")
  })
})
