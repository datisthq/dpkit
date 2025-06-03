import { describe, expect, it } from "vitest"
import { readCell } from "./read.js"

describe("readCell (number)", () => {
  it.each([
    { cell: 1, value: 1 },
    { cell: null, value: null },
  ])("%j", async ({ cell, value, ...rest }) => {
    const field = { name: "field", type: "number" as const, ...rest }
    expect(readCell({ cell, field })).toEqual(value)
  })
})
