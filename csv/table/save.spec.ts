import { readFile } from "node:fs/promises"
import { DataFrame } from "nodejs-polars"
import { temporaryFileTask } from "tempy"
import { describe, expect, it } from "vitest"
import { saveCsvTable } from "./save.js"

describe("saveCsvTable", () => {
  it("should save table to CSV file", async () => {
    await temporaryFileTask(async path => {
      const table = DataFrame({
        id: [1.0, 2.0, 3.0],
        name: ["Alice", "Bob", "Charlie"],
      }).lazy()

      await saveCsvTable(table, { path })

      const content = await readFile(path, "utf-8")
      expect(content).toEqual("id,name\n1.0,Alice\n2.0,Bob\n3.0,Charlie\n")
    })
  })

  it("should save with custom delimiter", async () => {
    await temporaryFileTask(async path => {
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
  })

  it("should save without header", async () => {
    await temporaryFileTask(async path => {
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
  })

  it("should save with custom quote char", async () => {
    await temporaryFileTask(async path => {
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
})
