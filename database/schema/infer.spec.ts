import { getTempFilePath } from "@dpkit/file"
import { useRecording } from "@dpkit/test"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { saveDatabaseTable } from "../table/index.ts"
import { inferDatabaseSchema } from "./infer.ts"

useRecording()

const dialect = { table: "dpkit" }

describe("inferDatabaseSchema", () => {
  it("should infer schema", async () => {
    const path = getTempFilePath()

    const source = pl
      .DataFrame([
        pl.Series("string", ["string"], pl.Utf8),
        pl.Series("integer", [1], pl.Int32),
        pl.Series("number", [1.1], pl.Float64),
      ])
      .lazy()

    await saveDatabaseTable(source, { path, dialect, format: "sqlite" })
    const schema = await inferDatabaseSchema({
      path,
      dialect,
      format: "sqlite",
    })

    expect(schema).toEqual({
      fields: [
        { name: "string", type: "string" },
        { name: "integer", type: "integer" },
        { name: "number", type: "number" },
      ],
    })
  })
})
