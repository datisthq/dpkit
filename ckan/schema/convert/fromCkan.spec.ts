import { describe, expect, it } from "vitest"
import type { CkanSchema } from "../Schema.ts"
import ckanSchemaFixture from "./fixtures/ckan-schema.json" with {
  type: "json",
}
import { convertSchemaFromCkan } from "./fromCkan.ts"

describe("convertSchemaFromCkan", () => {
  it("converts a CKAN schema to a Frictionless schema", () => {
    const ckanSchema = ckanSchemaFixture as CkanSchema

    const result = convertSchemaFromCkan(ckanSchema)

    expect(result.fields).toHaveLength(ckanSchema.fields.length)

    const idField = result.fields.find(f => f.name === "id")
    expect(idField).toBeDefined()
    if (idField) {
      expect(idField.type).toEqual("integer")
      expect(idField.title).toEqual("ID")
      expect(idField.description).toEqual("Unique identifier")
    }

    const nameField = result.fields.find(f => f.name === "name")
    expect(nameField).toBeDefined()
    if (nameField) {
      expect(nameField.type).toEqual("string")
      expect(nameField.title).toEqual("Name")
      expect(nameField.description).toEqual("Person's full name")
    }

    const ageField = result.fields.find(f => f.name === "age")
    expect(ageField).toBeDefined()
    if (ageField) {
      expect(ageField.type).toEqual("integer")
      expect(ageField.title).toBeUndefined()
      expect(ageField.description).toBeUndefined()
    }

    const scoreField = result.fields.find(f => f.name === "score")
    expect(scoreField).toBeDefined()
    if (scoreField) {
      expect(scoreField.type).toEqual("number")
      expect(scoreField.title).toEqual("Score")
      expect(scoreField.description).toEqual("Test score")
    }

    const isActiveField = result.fields.find(f => f.name === "is_active")
    expect(isActiveField).toBeDefined()
    if (isActiveField) {
      expect(isActiveField.type).toEqual("boolean")
    }

    const birthDateField = result.fields.find(f => f.name === "birth_date")
    expect(birthDateField).toBeDefined()
    if (birthDateField) {
      expect(birthDateField.type).toEqual("date")
      expect(birthDateField.title).toEqual("Birth Date")
      expect(birthDateField.description).toEqual("Date of birth")
    }

    const startTimeField = result.fields.find(f => f.name === "start_time")
    expect(startTimeField).toBeDefined()
    if (startTimeField) {
      expect(startTimeField.type).toEqual("time")
    }

    const createdAtField = result.fields.find(f => f.name === "created_at")
    expect(createdAtField).toBeDefined()
    if (createdAtField) {
      expect(createdAtField.type).toEqual("datetime")
      expect(createdAtField.title).toEqual("Created At")
      expect(createdAtField.description).toEqual(
        "Timestamp when record was created",
      )
    }

    const metadataField = result.fields.find(f => f.name === "metadata")
    expect(metadataField).toBeDefined()
    if (metadataField) {
      expect(metadataField.type).toEqual("object")
    }

    const tagsField = result.fields.find(f => f.name === "tags")
    expect(tagsField).toBeDefined()
    if (tagsField) {
      expect(tagsField.type).toEqual("array")
      expect(tagsField.title).toEqual("Tags")
      expect(tagsField.description).toEqual("List of tags")
    }
  })

  it("converts CKAN type aliases to Frictionless types", () => {
    const ckanSchema = ckanSchemaFixture as CkanSchema

    const result = convertSchemaFromCkan(ckanSchema)

    const stringField = result.fields.find(f => f.name === "string_field")
    expect(stringField?.type).toEqual("string")

    const integerField = result.fields.find(f => f.name === "integer_field")
    expect(integerField?.type).toEqual("integer")

    const numberField = result.fields.find(f => f.name === "number_field")
    expect(numberField?.type).toEqual("number")

    const floatField = result.fields.find(f => f.name === "float_field")
    expect(floatField?.type).toEqual("number")

    const booleanField = result.fields.find(f => f.name === "boolean_field")
    expect(booleanField?.type).toEqual("boolean")

    const datetimeField = result.fields.find(f => f.name === "datetime_field")
    expect(datetimeField?.type).toEqual("datetime")

    const objectField = result.fields.find(f => f.name === "object_field")
    expect(objectField?.type).toEqual("object")
  })

  it("handles unknown field types by converting to 'any'", () => {
    const ckanSchema = ckanSchemaFixture as CkanSchema

    const result = convertSchemaFromCkan(ckanSchema)

    const unknownField = result.fields.find(f => f.name === "unknown_field")
    expect(unknownField).toBeDefined()
    if (unknownField) {
      expect(unknownField.type).toEqual("any")
    }
  })

  it("respects type_override in field info", () => {
    const ckanSchema = ckanSchemaFixture as CkanSchema

    const result = convertSchemaFromCkan(ckanSchema)

    const overrideField = result.fields.find(f => f.name === "override_field")
    expect(overrideField).toBeDefined()
    if (overrideField) {
      expect(overrideField.type).toEqual("integer")
      expect(overrideField.title).toEqual("Override Field")
      expect(overrideField.description).toEqual("Field with type override")
    }
  })

  it("handles empty fields array", () => {
    const ckanSchema: CkanSchema = {
      fields: [],
    }

    const result = convertSchemaFromCkan(ckanSchema)

    expect(result.fields).toEqual([])
  })

  it("handles fields without info object", () => {
    const ckanSchema: CkanSchema = {
      fields: [
        {
          id: "simple_field",
          type: "text",
        },
      ],
    }

    const result = convertSchemaFromCkan(ckanSchema)

    expect(result.fields).toHaveLength(1)
    const field = result.fields[0]
    expect(field).toBeDefined()
    if (field) {
      expect(field.name).toEqual("simple_field")
      expect(field.type).toEqual("string")
      expect(field.title).toBeUndefined()
      expect(field.description).toBeUndefined()
    }
  })

  it("handles case insensitivity in type conversion", () => {
    const ckanSchema: CkanSchema = {
      fields: [
        { id: "field1", type: "TEXT" },
        { id: "field2", type: "INT" },
        { id: "field3", type: "BOOL" },
        { id: "field4", type: "TIMESTAMP" },
      ],
    }

    const result = convertSchemaFromCkan(ckanSchema)

    expect(result.fields[0]?.type).toEqual("string")
    expect(result.fields[1]?.type).toEqual("integer")
    expect(result.fields[2]?.type).toEqual("boolean")
    expect(result.fields[3]?.type).toEqual("datetime")
  })
})
