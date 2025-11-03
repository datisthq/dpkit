import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "./normalize.ts"

describe("normalizeTable", () => {
  it("should work with schema", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work with less fields in data", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
        { name: "other", type: "boolean" },
      ],
    }

    const records = [
      { id: 1, name: "english", other: null },
      { id: 2, name: "中文", other: null },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work with more fields in data", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
        other: [true, false],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work based on fields order", async () => {
    const table = pl
      .DataFrame({
        field1: [1, 2],
        field2: ["english", "中文"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work based on field names (equal)", async () => {
    const table = pl
      .DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      })
      .lazy()

    const schema: Schema = {
      fieldsMatch: "equal",
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work based on field names (subset)", async () => {
    const table = pl
      .DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      })
      .lazy()

    const schema: Schema = {
      fieldsMatch: "subset",
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work based on field names (superset)", async () => {
    const table = pl
      .DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      })
      .lazy()

    const schema: Schema = {
      fieldsMatch: "superset",
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should work based on field names (partial)", async () => {
    const table = pl
      .DataFrame({
        name: ["english", "中文"],
        id: [1, 2],
      })
      .lazy()

    const schema: Schema = {
      fieldsMatch: "partial",
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should parse string columns", async () => {
    const table = pl
      .DataFrame({
        id: ["1", "2"],
        name: ["english", "中文"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "string" },
      ],
    }

    const records = [
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })

  it("should read type errors as nulls", async () => {
    const table = pl
      .DataFrame({
        id: [1, 2],
        name: ["english", "中文"],
      })
      .lazy()

    const schema: Schema = {
      fields: [
        { name: "id", type: "integer" },
        { name: "name", type: "integer" },
      ],
    }

    const records = [
      { id: 1, name: null },
      { id: 2, name: null },
    ]

    const ldf = await normalizeTable(table, schema)
    const df = await ldf.collect()
    expect(df.toRecords()).toEqual(records)
  })
})
