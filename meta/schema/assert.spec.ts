import { describe, expect, expectTypeOf, it } from "vitest"
import { AssertionError } from "../descriptor/assert.js"
import type { Schema } from "./Schema.js"
import { assertSchema } from "./assert.js"

describe("assertSchema", () => {
  it("returns typed schema when valid", async () => {
    const validSchema: Schema = {
      fields: [
        {
          name: "id",
          type: "integer",
        },
        {
          name: "name",
          type: "string",
        },
      ],
      primaryKey: ["id"],
    }

    const result = await assertSchema({
      descriptor: validSchema,
    })

    expectTypeOf(result).toEqualTypeOf<Schema>()
    expect(result).toEqual(validSchema)
  })

  it("throws ValidationError when schema is invalid", async () => {
    const invalidSchema = {
      fields: [
        {
          name: "id",
          type: 123, // Should be a string
        },
      ],
    }

    await expect(
      assertSchema({
        descriptor: invalidSchema,
      }),
    ).rejects.toThrow(AssertionError)
  })
})
