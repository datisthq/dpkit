import { access, unlink } from "node:fs/promises"
import { writeTempFile } from "@dpkit/file"
import { describe, expect, it } from "vitest"
import { assert } from "vitest"
import { loadTable } from "./load.ts"
import { saveTable } from "./save.ts"

describe("saveTable", () => {
  it("should save table to CSV file", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(typeof savedPath).toBe("string")
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with format option", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save and reload table with same data", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }
    const originalTable = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(originalTable, "table is not defined")
    await saveTable(originalTable, {
      path: outputPath,
      format: "csv" as const,
    })
    const reloadedTable = await loadTable({
      path: outputPath,
      format: "csv" as const,
    })

    expect(reloadedTable).toBeDefined()
    expect(typeof reloadedTable).toBe("object")
    await unlink(outputPath)
  })

  it("should save table with different data types", async () => {
    const csvPath = await writeTempFile(
      "id,score,active\n1,95.5,true\n2,87.3,false",
    )
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with custom delimiter", async () => {
    const csvPath = await writeTempFile("id,name\n1,alice\n2,bob")
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
      delimiter: "|",
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table from inline data", async () => {
    const resource = {
      name: "test-resource",
      type: "table" as const,
      data: [
        { id: 1, name: "alice" },
        { id: 2, name: "bob" },
      ],
    }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with special characters", async () => {
    const csvPath = await writeTempFile(
      'id,name,note\n1,"alice","Test, data"\n2,"bob","Normal"',
    )
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with numeric values", async () => {
    const csvPath = await writeTempFile("id,value\n1,100\n2,200.5\n3,300")
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with boolean values", async () => {
    const csvPath = await writeTempFile("id,active\n1,true\n2,false\n3,true")
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })

  it("should save table with date values", async () => {
    const csvPath = await writeTempFile(
      "id,created\n1,2024-01-01\n2,2024-01-02",
    )
    const resource = { path: csvPath, format: "csv" as const }
    const table = await loadTable(resource)
    const outputPath = await writeTempFile("")
    await unlink(outputPath)

    assert(table, "table is not defined")
    const savedPath = await saveTable(table, {
      path: outputPath,
      format: "csv" as const,
    })

    expect(savedPath).toBeDefined()
    expect(
      await access(savedPath)
        .then(() => true)
        .catch(() => false),
    ).toBe(true)
    await unlink(savedPath)
  })
})
