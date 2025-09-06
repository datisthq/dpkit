import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { readRecords } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveJsonTable } from "./save.ts"

const row1 = { id: 1, name: "english" }
const row2 = { id: 2, name: "中文" }
const table = readRecords([row1, row2]).lazy()

describe("saveJsonTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, { path, format: "json" })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(JSON.stringify([row1, row2], null, 2))
  })

  it("should handle property", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, {
      path,
      format: "json",
      dialect: { property: "key" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(JSON.stringify({ key: [row1, row2] }, null, 2))
  })

  it("should handle item keys", async () => {
    const path = getTempFilePath()

    await saveJsonTable(table, {
      path,
      format: "json",
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
      format: "json",
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
})
