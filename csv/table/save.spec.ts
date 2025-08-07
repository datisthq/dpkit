import { readFile } from "node:fs/promises"
import { getTempFilePath } from "@dpkit/file"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveCsvTable } from "./save.js"

describe("saveCsvTable", () => {
  it("should save table to file", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, { path })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id,name\n1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom delimiter", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { delimiter: ";" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("id;name\n1.0;Alice\n2.0;Bob\n3.0;Charlie\n")
  })

  it("should save without header", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { header: false },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual("1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
  })

  it("should save with custom quote char", async () => {
    const path = getTempFilePath()
    const table = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice,Smith", "Bob,Jones", "Charlie,Brown"],
    }).lazy()

    await saveCsvTable(table, {
      path,
      dialect: { quoteChar: "'" },
    })

    const content = await readFile(path, "utf-8")
    expect(content).toEqual(
      "id,name\n1.0,'Alice,Smith'\n2.0,'Bob,Jones'\n3.0,'Charlie,Brown'\n",
    )
  })
})
