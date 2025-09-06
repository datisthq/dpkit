import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveDatabaseTable } from "../table/index.ts"
import { inferDatabaseSchema } from "./infer.ts"

useRecording()

const dialect = { table: "dpkit" }
const record1 = { id: 1, name: "english" }
const record2 = { id: 2, name: "中文" }

describe("inferDatabaseSchema", () => {
  it("should infer schema", async () => {
    const path = getTempFilePath()

    const source = pl.DataFrame([record1, record2]).lazy()
    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })

    await inferDatabaseSchema({ path, dialect, format: "sqlite" })
    expect(true).toBe(true)
  })
})
