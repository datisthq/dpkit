import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { DataFrame, DataType, Series } from "nodejs-polars"
import { readRecords } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadJsonTable } from "./load.ts"
import { saveJsonTable } from "./save.ts"

const row1 = { id: 1, name: "english" }
const row2 = { id: 2, name: "中文" }
const table = readRecords([row1, row2]).lazy()

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

    const source = DataFrame([
      Series("array", ["[1, 2, 3]"], DataType.String),
      Series("boolean", [true], DataType.Bool),
      Series("date", [new Date(Date.UTC(2025, 0, 1))], DataType.Date),
      Series("datetime", [new Date(Date.UTC(2025, 0, 1))], DataType.Datetime),
      Series("duration", ["P23DT23H"], DataType.String),
      Series("geojson", ['{"value": 1}'], DataType.String),
      Series("geopoint", [[40.0, 50.0]], DataType.List(DataType.Float32)),
      Series("integer", [1], DataType.Int32),
      Series("list", [[1.0, 2.0, 3.0]], DataType.List(DataType.Int32)),
      Series("number", [1.1], DataType.Float64),
      Series("object", ['{"value": 1}']),
      Series("string", ["string"], DataType.String),
      Series("time", [new Date(Date.UTC(2025, 0, 1))], DataType.Time),
      Series("year", [2025], DataType.Int32),
      Series("yearmonth", [[2025, 1]], DataType.List(DataType.Int16)),
    ]).lazy()

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
