import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { parseDurationField } from "./duration.js"

describe("parseDurationField", () => {
  it.each([["P23DT23H", "P23DT23H", {}]])(
    "$0 -> $1 $2",
    async (cell, value, options) => {
      const field = { name: "name", type: "duration" as const, ...options }
      const df = DataFrame({ name: [cell] }).select(parseDurationField(field))
      expect(df.getColumn("name").get(0)).toEqual(value)
    },
  )
})
