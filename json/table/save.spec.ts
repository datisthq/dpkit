import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadJsonTable } from "./load.ts"
import { saveJsonTable } from "./save.ts"

const row1 = { id: 1, name: "english" }
const row2 = { id: 2, name: "中文" }
const table = pl.readRecords([row1, row2]).lazy()

describe("saveJsonTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(JSON.stringify([row1, row2], null, 2))
  })

  it("should handle property", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, {
      path,
      dialect: { property: "key" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(JSON.stringify({ key: [row1, row2] }, null, 2))
  })

  it("should handle item keys", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, {
      path,
      dialect: { itemKeys: ["name"] },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      JSON.stringify([{ name: row1.name }, { name: row2.name }], null, 2),
    )
  })

  it("should handle item type (array)", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, {
      path,
      dialect: { itemType: "array" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      JSON.stringify(
        [Object.keys(row1), Object.values(row1), Object.values(row2)],
        null,
        2,
      ),
    )
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

    await saveJsonTable(source, {
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

    const target = await loadJsonTable({ path }, { denormalized: true })
    expect((await target.collect()).toRecords()).toEqual([
      {
        array: "[1, 2, 3]",
        boolean: true,
        date: "2025-01-01",
        datetime: "2025-01-01T00:00:00",
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

describe("saveJsonTable (format=jsonl)", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, { path, format: "jsonl" })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [JSON.stringify(row1), JSON.stringify(row2)].join("\n"),
    )
  })

  it("should handle item keys", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, {
      path,
      format: "jsonl",
      dialect: { itemKeys: ["name"] },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [
        JSON.stringify({ name: row1.name }),
        JSON.stringify({ name: row2.name }),
      ].join("\n"),
    )
  })

  it("should handle item type (array)", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, {
      path,
      format: "jsonl",
      dialect: { itemType: "array" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [
        JSON.stringify(Object.keys(row1)),
        JSON.stringify(Object.values(row1)),
        JSON.stringify(Object.values(row2)),
      ].join("\n"),
    )
  })

  it("should handle item type (object)", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, {
      path,
      format: "jsonl",
      dialect: { itemType: "object" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [JSON.stringify(row1), JSON.stringify(row2)].join("\n"),
    )
  })
})
