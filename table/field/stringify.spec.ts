import type { Schema } from "@dpkit/core"
import * as pl from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { denormalizeTable } from "../table/index.ts"

describe("stringifyField", () => {
  describe("missing values", () => {
    it.each([
      // Schema-level - null values should be converted to first missing value
      [null, "", {}],
      [null, "", { schemaLevel: [] }], // defaults to ""
      [null, "-", { schemaLevel: ["-"] }],
      [null, "x", { schemaLevel: ["x"] }],

      // Regular values should remain unchanged
      ["hello", "hello", {}],
      ["world", "world", { schemaLevel: ["-"] }],

      // Field-level missing values take precedence
      [null, "", {}], // default field-level missing value
      [null, "-", { fieldLevel: ["-"] }],
      [null, "n/a", { fieldLevel: ["n/a"] }],

      // Regular values with field-level settings
      ["test", "test", { fieldLevel: ["-"] }],
      ["value", "value", { fieldLevel: ["n/a"] }],

      // Field-level overrides schema-level
      [null, "-", { schemaLevel: ["x"], fieldLevel: ["-"] }],
      [null, "x", { schemaLevel: ["-"], fieldLevel: ["x"] }],

      // Multiple missing values - should use first one
      [null, "-", { fieldLevel: ["-", "n/a", "null"] }],
      [null, "n/a", { schemaLevel: ["n/a", "NULL", ""] }],

      // @ts-ignore
    ])("%s -> %s %s", async (value, expected, { fieldLevel, schemaLevel }) => {
      const table = pl.DataFrame({ name: [value] }).lazy()
      const schema: Schema = {
        missingValues: schemaLevel,
        fields: [{ name: "name", type: "string", missingValues: fieldLevel }],
      }

      const result = await denormalizeTable(table, schema)
      const frame = await result.collect()

      expect(frame.toRecords()[0]?.name).toEqual(expected)
    })
  })
})
