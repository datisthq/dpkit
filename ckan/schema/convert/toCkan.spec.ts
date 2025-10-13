import type { Schema } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import type { CkanSchema } from "../Schema.ts"
import ckanSchemaFixture from "./fixtures/ckan-schema.json" with {
  type: "json",
}
import { convertSchemaFromCkan } from "./fromCkan.ts"
import { convertSchemaToCkan } from "./toCkan.ts"

describe("convertSchemaToCkan", () => {
  it("converts a Frictionless schema to a CKAN schema", () => {
    const schema: Schema = {
      fields: [
        {
          name: "id",
          type: "integer",
          title: "ID",
          description: "Unique identifier",
        },
        {
          name: "name",
          type: "string",
          title: "Name",
          description: "Person's full name",
        },
        {
          name: "age",
          type: "integer",
        },
        {
          name: "score",
          type: "number",
          title: "Score",
          description: "Test score",
        },
        {
          name: "is_active",
          type: "boolean",
        },
        {
          name: "birth_date",
          type: "date",
          title: "Birth Date",
          description: "Date of birth",
        },
        {
          name: "start_time",
          type: "time",
        },
        {
          name: "created_at",
          type: "datetime",
          title: "Created At",
          description: "Timestamp when record was created",
        },
        {
          name: "metadata",
          type: "object",
        },
        {
          name: "tags",
          type: "array",
          title: "Tags",
          description: "List of tags",
        },
        {
          name: "location",
          type: "geopoint",
        },
        {
          name: "boundary",
          type: "geojson",
        },
      ],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toHaveLength(schema.fields.length)

    const idField = result.fields.find(f => f.id === "id")
    expect(idField).toBeDefined()
    if (idField) {
      expect(idField.type).toEqual("int")
      expect(idField.info).toBeDefined()
      expect(idField.info?.label).toEqual("ID")
      expect(idField.info?.notes).toEqual("Unique identifier")
      expect(idField.info?.type_override).toEqual("int")
    }

    const nameField = result.fields.find(f => f.id === "name")
    expect(nameField).toBeDefined()
    if (nameField) {
      expect(nameField.type).toEqual("text")
      expect(nameField.info).toBeDefined()
      expect(nameField.info?.label).toEqual("Name")
      expect(nameField.info?.notes).toEqual("Person's full name")
      expect(nameField.info?.type_override).toEqual("text")
    }

    const ageField = result.fields.find(f => f.id === "age")
    expect(ageField).toBeDefined()
    if (ageField) {
      expect(ageField.type).toEqual("int")
      expect(ageField.info).toBeUndefined()
    }

    const scoreField = result.fields.find(f => f.id === "score")
    expect(scoreField).toBeDefined()
    if (scoreField) {
      expect(scoreField.type).toEqual("numeric")
      expect(scoreField.info).toBeDefined()
      expect(scoreField.info?.label).toEqual("Score")
      expect(scoreField.info?.notes).toEqual("Test score")
      expect(scoreField.info?.type_override).toEqual("numeric")
    }

    const isActiveField = result.fields.find(f => f.id === "is_active")
    expect(isActiveField).toBeDefined()
    if (isActiveField) {
      expect(isActiveField.type).toEqual("bool")
      expect(isActiveField.info).toBeUndefined()
    }

    const birthDateField = result.fields.find(f => f.id === "birth_date")
    expect(birthDateField).toBeDefined()
    if (birthDateField) {
      expect(birthDateField.type).toEqual("date")
      expect(birthDateField.info).toBeDefined()
      expect(birthDateField.info?.label).toEqual("Birth Date")
      expect(birthDateField.info?.notes).toEqual("Date of birth")
      expect(birthDateField.info?.type_override).toEqual("date")
    }

    const startTimeField = result.fields.find(f => f.id === "start_time")
    expect(startTimeField).toBeDefined()
    if (startTimeField) {
      expect(startTimeField.type).toEqual("time")
      expect(startTimeField.info).toBeUndefined()
    }

    const createdAtField = result.fields.find(f => f.id === "created_at")
    expect(createdAtField).toBeDefined()
    if (createdAtField) {
      expect(createdAtField.type).toEqual("timestamp")
      expect(createdAtField.info).toBeDefined()
      expect(createdAtField.info?.label).toEqual("Created At")
      expect(createdAtField.info?.notes).toEqual(
        "Timestamp when record was created",
      )
      expect(createdAtField.info?.type_override).toEqual("timestamp")
    }

    const metadataField = result.fields.find(f => f.id === "metadata")
    expect(metadataField).toBeDefined()
    if (metadataField) {
      expect(metadataField.type).toEqual("json")
      expect(metadataField.info).toBeUndefined()
    }

    const tagsField = result.fields.find(f => f.id === "tags")
    expect(tagsField).toBeDefined()
    if (tagsField) {
      expect(tagsField.type).toEqual("array")
      expect(tagsField.info).toBeDefined()
      expect(tagsField.info?.label).toEqual("Tags")
      expect(tagsField.info?.notes).toEqual("List of tags")
      expect(tagsField.info?.type_override).toEqual("array")
    }

    const locationField = result.fields.find(f => f.id === "location")
    expect(locationField).toBeDefined()
    if (locationField) {
      expect(locationField.type).toEqual("geopoint")
    }

    const boundaryField = result.fields.find(f => f.id === "boundary")
    expect(boundaryField).toBeDefined()
    if (boundaryField) {
      expect(boundaryField.type).toEqual("geojson")
    }
  })

  it("handles fields with only title", () => {
    const schema: Schema = {
      fields: [
        {
          name: "field1",
          type: "string",
          title: "Field 1",
        },
      ],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toHaveLength(1)
    const field = result.fields[0]
    expect(field).toBeDefined()
    if (field) {
      expect(field.id).toEqual("field1")
      expect(field.type).toEqual("text")
      expect(field.info).toBeDefined()
      expect(field.info?.label).toEqual("Field 1")
      expect(field.info?.notes).toBeUndefined()
      expect(field.info?.type_override).toEqual("text")
    }
  })

  it("handles fields with only description", () => {
    const schema: Schema = {
      fields: [
        {
          name: "field1",
          type: "string",
          description: "Field 1 description",
        },
      ],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toHaveLength(1)
    const field = result.fields[0]
    expect(field).toBeDefined()
    if (field) {
      expect(field.id).toEqual("field1")
      expect(field.type).toEqual("text")
      expect(field.info).toBeDefined()
      expect(field.info?.label).toBeUndefined()
      expect(field.info?.notes).toEqual("Field 1 description")
      expect(field.info?.type_override).toEqual("text")
    }
  })

  it("handles fields without title or description", () => {
    const schema: Schema = {
      fields: [
        {
          name: "simple_field",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toHaveLength(1)
    const field = result.fields[0]
    expect(field).toBeDefined()
    if (field) {
      expect(field.id).toEqual("simple_field")
      expect(field.type).toEqual("text")
      expect(field.info).toBeUndefined()
    }
  })

  it("handles empty fields array", () => {
    const schema: Schema = {
      fields: [],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toEqual([])
  })

  it("converts unknown field types to 'text'", () => {
    const schema: Schema = {
      fields: [
        {
          name: "unknown_field",
          type: "unknown" as any,
        },
      ],
    }

    const result = convertSchemaToCkan(schema)

    expect(result.fields).toHaveLength(1)
    const field = result.fields[0]
    expect(field).toBeDefined()
    if (field) {
      expect(field.type).toEqual("text")
    }
  })

  it("performs a round-trip conversion (CKAN → Frictionless → CKAN)", () => {
    const originalCkanSchema = ckanSchemaFixture as CkanSchema

    const frictionlessSchema = convertSchemaFromCkan(originalCkanSchema)

    const resultCkanSchema = convertSchemaToCkan(frictionlessSchema)

    expect(resultCkanSchema.fields).toHaveLength(originalCkanSchema.fields.length)

    originalCkanSchema.fields.forEach(originalField => {
      const resultField = resultCkanSchema.fields.find(
        f => f.id === originalField.id,
      )
      expect(resultField).toBeDefined()

      if (resultField && originalField) {
        expect(resultField.id).toEqual(originalField.id)

        if (originalField.info) {
          expect(resultField.info).toBeDefined()
          if (resultField.info) {
            if (originalField.info.label) {
              expect(resultField.info.label).toEqual(originalField.info.label)
            }
            if (originalField.info.notes) {
              expect(resultField.info.notes).toEqual(originalField.info.notes)
            }
          }
        }
      }
    })
  })
})
