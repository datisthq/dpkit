import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { readInlineResourceTable } from "./read.js"

describe("readInlineResourceTable", () => {
  it.skip("should return empty table if not data", async () => {
    const resource: Resource = {
      name: "test",
      type: "table",
    }

    const table = await readInlineResourceTable({ resource })
    expect(table).toEqual(DataFrame().lazy())
  })

  it.skip("should return empty table if bad data", async () => {
    const resource: Resource = {
      name: "test",
      type: "table",
      data: "bad",
    }

    const table = await readInlineResourceTable({ resource })
    expect(table).toEqual(DataFrame())
  })

  it.skip("should read without schema", async () => {
    const resource: Resource = {
      name: "test",
      type: "table",
      data: [
        ["id", "name"],
        [1, "english"],
        [2, "中文"],
      ],
    }

    const table = await readInlineResourceTable({ resource })
    console.log(await table.collect())
  })

  it("should read with schema", async () => {
    const resource: Resource = {
      name: "test",
      type: "table",
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
    }

    const table = await readInlineResourceTable({ resource })
    const records = (await table.collect()).toRecords()

    expect(records).toEqual([
      { id: 1, name: "english" },
      { id: 2, name: "中文" },
    ])
  })
})
