import { useRecording } from "@dpkit/test"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadPackageFromDatabase } from "../package/index.ts"
import { inferDatabaseSchema } from "../schema/index.ts"
import { loadDatabaseTable, saveDatabaseTable } from "../table/index.ts"
import { createAdapter } from "./create.ts"

useRecording()

const path = process.env.DPKIT_MYSQL_URL

// Vitest runs in-file tests sequentially so we can use the same table
const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe.skipIf(!path)("MysqlAdapter", () => {
  if (!path) return

  it("should infer schema", async () => {
    const source = pl
      .DataFrame([
        pl.Series("string", ["string"], pl.DataType.Utf8),
        pl.Series("integer", [1], pl.DataType.Int32),
        pl.Series("number", [1.1], pl.DataType.Float64),
      ])
      .lazy()

    await saveDatabaseTable(source, {
      path,
      dialect,
      format: "mysql",
      overwrite: true,
    })

    const schema = await inferDatabaseSchema({
      path,
      dialect,
      format: "mysql",
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
    const source = pl.DataFrame([record1, record2]).lazy()

    await saveDatabaseTable(source, {
      path,
      dialect,
      format: "mysql",
      overwrite: true,
    })

    const target = await loadDatabaseTable({
      path,
      dialect,
      format: "mysql",
    })

    expect((await target.collect()).toRecords()).toEqual([record1, record2])
  })

  it("should save/load table with various data types", async () => {
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

    await saveDatabaseTable(source, {
      path,
      dialect,
      format: "mysql",
      overwrite: true,
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
      { path, dialect, format: "mysql" },
      { denormalized: true },
    )

    expect((await target.collect()).toRecords()).toEqual([
      {
        array: "[1, 2, 3]",
        boolean: 1,
        date: "2025-01-01",
        datetime: new Date(Date.UTC(2025, 0, 1)),
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
    const adapter = createAdapter("mysql")
    const database = await adapter.connectDatabase(path)

    await database.schema.dropTable("table1").ifExists().execute()
    await database.schema
      .createTable("table1")
      .ifNotExists()
      .addColumn("id", "integer", column => column.notNull())
      .addColumn("name", "text")
      .execute()

    await database.schema.dropTable("table2").ifExists().execute()
    await database.schema
      .createTable("table2")
      .ifNotExists()
      .addColumn("id", "integer", column => column.notNull())
      .addColumn("number", "numeric")
      .addColumn("datetime", "datetime")
      .execute()

    const datapackage = await loadPackageFromDatabase(path, {
      format: "mysql",
      includeTables: ["table1", "table2"],
    })

    expect(datapackage).toEqual({
      resources: [
        {
          path,
          name: "table1",
          format: "mysql",
          dialect: { table: "table1" },
          schema: {
            fields: [
              { name: "id", type: "integer", constraints: { required: true } },
              { name: "name", type: "string" },
            ],
          },
        },
        {
          path,
          name: "table2",
          format: "mysql",
          dialect: { table: "table2" },
          schema: {
            fields: [
              { name: "id", type: "integer", constraints: { required: true } },
              { name: "number", type: "number" },
              { name: "datetime", type: "datetime" },
            ],
          },
        },
      ],
    })
  })
})
