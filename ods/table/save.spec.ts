import { getTempFilePath } from "@dpkit/file"
import { readRecords } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveOdsTable } from "./save.ts"
import { readTestData } from "./test.ts"

const row1 = { id: 1, name: "english" }
const row2 = { id: 2, name: "中文" }
const table = readRecords([row1, row2]).lazy()

describe("saveOdsTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    await saveOdsTable(table, { path })

    const data = await readTestData(path)
    expect(data).toEqual([row1, row2])
  })
})
