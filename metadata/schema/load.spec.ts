import { join } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Schema } from "./Schema.ts"
import { loadSchema } from "./load.ts"

describe("loadSchema", () => {
  const getFixturePath = (name: string) =>
    join(import.meta.dirname, "fixtures", name)
  const expectedSchema = {
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
  }

  it("loads a schema from a local file path", async () => {
    const schema = await loadSchema(getFixturePath("schema.json"))

    expectTypeOf(schema).toEqualTypeOf<Schema>()
    expect(schema).toEqual(expectedSchema)
  })

  it("throws an error when schema is invalid", async () => {
    await expect(
      loadSchema(getFixturePath("schema-invalid.json")),
    ).rejects.toThrow()
  })
})
