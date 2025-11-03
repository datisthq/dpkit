import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { normalizeTable } from "../table/index.ts"

describe("parseField", () => {
  describe("missing values", () => {
    it.each([
      // Schema-level
      ["", null, {}],
      ["", "", { schemaLevel: [] }],
      ["-", null, { schemaLevel: ["-"] }],
      ["x", null, { schemaLevel: ["x"] }],

      // Field-level
      ["", null, {}],
      ["-", null, { fieldLevel: ["-"] }],
      ["-", "-", { fieldLevel: [""] }],
      ["n/a", null, { fieldLevel: ["n/a"] }],

      // Schema-level and field-level
      ["-", null, { schemaLevel: ["x"], fieldLevel: ["-"] }],
      ["-", "-", { schemaLevel: ["-"], fieldLevel: ["x"] }],
      // @ts-ignore
    ])("$0 -> $1 $2", async (cell, value, { fieldLevel, schemaLevel }) => {
      const table = pl.DataFrame({ name: [cell] }).lazy()
      const schema: Schema = {
        missingValues: schemaLevel,
        fields: [{ name: "name", type: "string", missingValues: fieldLevel }],
      }

      const result = await normalizeTable(table, schema)
      const frame = await result.collect()

      expect(frame.getColumn("name").get(0)).toEqual(value)
    })
  })
})
