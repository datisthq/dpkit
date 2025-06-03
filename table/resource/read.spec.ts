import { describe, expect, it } from "vitest"
import { readInlineResourceTable } from "./read.js"

describe("readInlineResourceTable", () => {
  it.each([
    {
      description: "should handle no data",
      records: [],
    },
    {
      description: "should handle bad data",
      data: "bad",
      records: [],
    },
    {
      description: "should read arrays",
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文"],
      ],
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should read objects",
      data: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should read with schema",
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文"],
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should read type errors as nulls",
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文"],
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "integer" },
        ],
      },
      records: [
        { id: 1, name: null },
        { id: 2, name: null },
      ],
    },
    {
      description: "should handle longer rows",
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文", "bad"], // extra cell
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should handle shorter rows",
      data: [
        ["id", "name"],
        [1, "english"],
        [2], // missing cell
      ],
      schema: {
        fields: [
          { name: "id", type: "integer" },
          { name: "name", type: "string" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: null },
      ],
    },
    {
      description: "should handle various data types",
      data: [
        {
          string: "string",
          number: 1,
          boolean: true,
          date: new Date("2025-01-01"),
          time: new Date("2025-01-01"),
          datetime: new Date("2025-01-01"),
        },
      ],
      records: [
        {
          string: "string",
          number: 1,
          boolean: true,
          date: new Date("2025-01-01"),
          time: new Date("2025-01-01"),
          datetime: new Date("2025-01-01"),
        },
      ],
    },
  ])("$description", async ({ data, schema, records }) => {
    const resource = { name: "test", type: "table", data, schema }

    // @ts-ignore
    const table = await readInlineResourceTable({ resource })
    const df = await table.collect()

    expect(records).toEqual(df.toRecords())
  })
})
