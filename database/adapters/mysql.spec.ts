import { useRecording } from "@dpkit/test"
import { DataFrame, DataType, Series } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadPackageFromDatabase } from "../package/index.ts"
import { inferDatabaseSchema } from "../schema/index.ts"
import { loadDatabaseTable, saveDatabaseTable } from "../table/index.ts"
import { createAdapter } from "./create.ts"

useRecording()

// Vitest runs in-file tests sequentially so we can use the same table
const path = process.env.DPKIT_MYSQL_URL
const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe.skipIf(!path)("MysqlAdapter", () => {
  if (!path) return

  it("should infer schema", async () => {
    const source = DataFrame([
      Series("string", ["string"], DataType.Utf8),
      Series("integer", [1], DataType.Int32),
      Series("number", [1.1], DataType.Float64),
    ]).lazy()

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
    const source = DataFrame([record1, record2]).lazy()

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
    const adapter = createAdapter("sqlite")
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
