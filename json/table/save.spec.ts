import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveJsonlTable } from "./save.js"

describe("saveJsonTable", () => {
  it("should save table to JSON file", async () => {
    const path = getTempFilePath()

    const table = DataFrame({
      id: [1.0, 2.0],
      name: ["english", "中文"],
    }).lazy()

    await saveJsonlTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      '{"id":1.0,"name":"english"}\n{"id":2.0,"name":"中文"}\n',
    )
  })
})
