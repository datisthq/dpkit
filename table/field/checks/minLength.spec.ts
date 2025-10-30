import type { Schema } from "@dpkit/core"
import { DataFrame } from "nodejs-polars"
import { describe, expect, it } from "vitest"
import { validateTable } from "../../table/index.ts"

describe("validateTable (cell/minLength)", () => {
  it("should not report errors for string values that meet the minLength constraint", async () => {
    const table = DataFrame({
      code: ["A123", "B456", "C789"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "code",
          type: "string",
          constraints: { minLength: 3 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors).toHaveLength(0)
  })

  it("should report an error for strings that are too short", async () => {
    const table = DataFrame({
      username: ["bob", "a", "christopher", "ab"],
    }).lazy()

    const schema: Schema = {
      fields: [
        {
          name: "username",
          type: "string",
          constraints: { minLength: 3 },
        },
      ],
    }

    const { errors } = await validateTable(table, { schema })
    expect(errors.filter(e => e.type === "cell/minLength")).toHaveLength(2)
    expect(errors).toContainEqual({
      type: "cell/minLength",
      fieldName: "username",
      minLength: 3,
      rowNumber: 2,
      cell: "a",
    })
    expect(errors).toContainEqual({
      type: "cell/minLength",
      fieldName: "username",
      minLength: 3,
      rowNumber: 4,
      cell: "ab",
    })
  })
})
