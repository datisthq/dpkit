import { join } from "node:path"
import { describe, expect, expectTypeOf, it } from "vitest"
import type { Schema } from "./Schema.js"
import { loadSchema } from "./load.js"

describe("loadSchema", () => {
  const getFixturePath = (name: string) => join(__dirname, "fixtures", name)
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
    const schema = await loadSchema({ path: getFixturePath("schema.json") })

    expectTypeOf(schema).toEqualTypeOf<Schema>()
    expect(schema).toEqual(expectedSchema)
  })

  it("throws an error when schema is invalid", async () => {
    await expect(
      loadSchema({ path: getFixturePath("schema-invalid.json") }),
    ).rejects.toThrow()
  })
})
