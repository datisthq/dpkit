import { describe, expect, it } from "vitest"
import { loadInlineTable } from "./load.ts"

describe("loadInlineTable", () => {
  it("should throw on no data", async () => {
    const resource = { name: "test" }

    await expect(loadInlineTable(resource)).rejects.toThrow(
      "Resource data is not defined or tabular",
    )
  })

  it("should throw on bad data", async () => {
    const resource = { name: "test", data: "bad" }

    await expect(loadInlineTable(resource)).rejects.toThrow(
      "Resource data is not defined or tabular",
    )
  })

  it("should read arrays", async () => {
    const resource = {
      name: "test",
      type: "table" as const,
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文"],
      ],
    }

    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]).toEqual(frame.toRecords())
  })

  it("should read objects", async () => {
    const resource = {
      name: "test",
      type: "table",
      data: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
      schema: undefined,
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]).toEqual(frame.toRecords())
  })

  it("should handle longer rows", async () => {
    const resource = {
      name: "test",
      type: "table",
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
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ]).toEqual(frame.toRecords())
  })

  it("should handle shorter rows", async () => {
    const resource = {
      name: "test",
      type: "table",
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
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english" },
      { id: 2, name: null },
    ]).toEqual(frame.toRecords())
  })

  it("should handle various data types", async () => {
    const resource = {
      name: "test",
      type: "table",
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
      schema: undefined,
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      {
        string: "string",
        number: 1,
        boolean: true,
        date: new Date("2025-01-01"),
        time: new Date("2025-01-01"),
        datetime: new Date("2025-01-01"),
      },
    ]).toEqual(frame.toRecords())
  })

  it("should handle objects with shorter rows", async () => {
    const resource = {
      name: "test",
      type: "table",
      data: [{ id: 1, name: "english" }, { id: 2, name: "中文" }, { id: 3 }],
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
      { id: 3, name: null },
    ]).toEqual(frame.toRecords())
  })

  it("should handle objects with longer rows", async () => {
    const resource = {
      name: "test",
      type: "table",
      data: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
        { id: 3, name: "german", extra: "extra" },
      ],
    }

    // @ts-ignore
    const table = await loadInlineTable(resource)
    const frame = await table.collect()

    expect([
      { id: 1, name: "english", extra: null },
      { id: 2, name: "中文", extra: null },
      { id: 3, name: "german", extra: "extra" },
    ]).toEqual(frame.toRecords())
  })
})
