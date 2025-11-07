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

  it("loads a full schema with all features", async () => {
    const schema = await loadSchema(getFixturePath("schema-full.json"))

    expectTypeOf(schema).toEqualTypeOf<Schema>()
    expect(schema).toBeDefined()
    expect(schema.$schema).toBe(
      "https://datapackage.org/profiles/2.0/tableschema.json",
    )
    expect(schema.name).toBe("users")
    expect(schema.title).toBe("User Data Schema")
    expect(schema.description).toBe("A comprehensive schema for user data")

    expect(schema.fields).toHaveLength(9)
    expect(schema.fields[0]?.name).toBe("id")
    expect(schema.fields[0]?.type).toBe("integer")
    expect(schema.fields[0]?.constraints?.required).toBe(true)
    expect(schema.fields[0]?.constraints?.unique).toBe(true)

    expect(schema.fields[1]?.name).toBe("email")
    expect(schema.fields[1]?.type).toBe("string")
    expect(schema.fields[1]?.format).toBe("email")

    expect(schema.fields[6]?.name).toBe("created_at")
    expect(schema.fields[6]?.type).toBe("datetime")

    expect(schema.primaryKey).toEqual(["id"])

    expect(schema.uniqueKeys).toHaveLength(2)
    expect(schema.uniqueKeys?.[0]).toEqual(["email"])
    expect(schema.uniqueKeys?.[1]).toEqual(["name", "department_id"])

    expect(schema.foreignKeys).toHaveLength(1)
    expect(schema.foreignKeys?.[0]?.fields).toEqual(["department_id"])
    expect(schema.foreignKeys?.[0]?.reference?.resource).toBe("departments")
    expect(schema.foreignKeys?.[0]?.reference?.fields).toEqual(["id"])

    expect(schema.missingValues).toEqual(["", "NA", "N/A", "null"])
  })
})
