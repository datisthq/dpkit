import { getTempFilePath } from "@dpkit/file"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { loadParquetTable } from "./load.ts"
import { saveParquetTable } from "./save.ts"

describe("saveParquetTable", () => {
  it("should save table to Parquet file", async () => {
    const path = getTempFilePath()
    const source = DataFrame({
      id: [1.0, 2.0, 3.0],
      name: ["Alice", "Bob", "Charlie"],
    }).lazy()

    await saveParquetTable(source, { path })

    const table = await loadParquetTable({ path })
    expect((await table.collect()).toRecords()).toEqual([
      { id: 1.0, name: "Alice" },
      { id: 2.0, name: "Bob" },
      { id: 3.0, name: "Charlie" },
    ])
  })
})
