import type { Resource } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { readInlineResourceTable } from "./read.js"

describe("readInlineResourceTable", () => {
  it.each([
    {
      description: "should read arrays",
      resource: {
        name: "test",
        type: "table" as const,
        data: [
          ["id", "name"],
          [1, "english"],
          [2, "中文"],
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should read objects",
      resource: {
        name: "test",
        type: "table" as const,
        data: [
          { id: 1, name: "english" },
          { id: 2, name: "中文" },
        ],
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
    {
      description: "should read with schema",
      resource: {
        name: "test",
        type: "table" as const,
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
      },
      records: [
        { id: 1, name: "english" },
        { id: 2, name: "中文" },
      ],
    },
  ])("$description", async ({ resource, records }) => {
    // @ts-ignore
    const table = await readInlineResourceTable({ resource })
    expect(records).toEqual((await table.collect()).toRecords())
  })
})
