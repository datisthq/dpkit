import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { readRecords } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveJsonTable, saveJsonlTable } from "./save.js"

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
    await saveJsonTable(table, { path, dialect: { property: "key" } })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(JSON.stringify({ key: [row1, row2] }, null, 2))
  })

  it("should handle item keys", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, { path, dialect: { itemKeys: ["name"] } })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      JSON.stringify([{ name: row1.name }, { name: row2.name }], null, 2),
    )
  })

  it("should handle item type (array)", async () => {
    const path = getTempFilePath()
    await saveJsonTable(table, { path, dialect: { itemType: "array" } })

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

describe("saveJsonlTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    await saveJsonlTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [JSON.stringify(row1), JSON.stringify(row2)].join("\n"),
    )
  })

  it("should handle item keys", async () => {
    const path = getTempFilePath()
    await saveJsonlTable(table, { path, dialect: { itemKeys: ["name"] } })

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
    await saveJsonlTable(table, { path, dialect: { itemType: "array" } })

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
    await saveJsonlTable(table, { path, dialect: { itemType: "object" } })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      [JSON.stringify(row1), JSON.stringify(row2)].join("\n"),
    )
  })
})
