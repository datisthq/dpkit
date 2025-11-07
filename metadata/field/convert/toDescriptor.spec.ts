import { describe, expect, it } from "vitest"
import type { Field } from "../Field.ts"
import { convertFieldToDescriptor } from "./toDescriptor.ts"

describe("convertFieldToDescriptor", () => {
  it("should return a cloned descriptor", () => {
    const field: Field = { name: "id", type: "string" }

    const result = convertFieldToDescriptor(field)

    expect(result).toEqual(field)
    expect(result).not.toBe(field)
  })

  it("should convert string field to descriptor", () => {
    const field: Field = {
      name: "email",
      type: "string",
      format: "email",
      title: "Email Address",
      description: "User's email address",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("email")
    expect(result.type).toBe("string")
    expect(result.format).toBe("email")
    expect(result.title).toBe("Email Address")
    expect(result.description).toBe("User's email address")
  })

  it("should convert integer field to descriptor", () => {
    const field: Field = {
      name: "age",
      type: "integer",
      title: "Age",
      constraints: {
        required: true,
        minimum: 0,
        maximum: 150,
      },
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("age")
    expect(result.type).toBe("integer")
    expect(result.title).toBe("Age")
    expect(result.constraints).toEqual({
      required: true,
      minimum: 0,
      maximum: 150,
    })
  })

  it("should convert number field to descriptor", () => {
    const field: Field = {
      name: "score",
      type: "number",
      description: "Test score",
      constraints: {
        minimum: 0,
        maximum: 100,
      },
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("score")
    expect(result.type).toBe("number")
    expect(result.description).toBe("Test score")
    expect(result.constraints).toEqual({
      minimum: 0,
      maximum: 100,
    })
  })

  it("should convert boolean field to descriptor", () => {
    const field: Field = {
      name: "active",
      type: "boolean",
      title: "Active Status",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("active")
    expect(result.type).toBe("boolean")
    expect(result.title).toBe("Active Status")
  })

  it("should convert date field to descriptor", () => {
    const field: Field = {
      name: "birth_date",
      type: "date",
      description: "Date of birth",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("birth_date")
    expect(result.type).toBe("date")
    expect(result.description).toBe("Date of birth")
  })

  it("should convert datetime field to descriptor", () => {
    const field: Field = {
      name: "created_at",
      type: "datetime",
      title: "Created At",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("created_at")
    expect(result.type).toBe("datetime")
    expect(result.title).toBe("Created At")
  })

  it("should convert time field to descriptor", () => {
    const field: Field = {
      name: "start_time",
      type: "time",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("start_time")
    expect(result.type).toBe("time")
  })

  it("should convert object field to descriptor", () => {
    const field: Field = {
      name: "metadata",
      type: "object",
      constraints: {
        jsonSchema: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
          },
        },
      },
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("metadata")
    expect(result.type).toBe("object")
    expect((result.constraints as any)?.jsonSchema).toEqual({
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
    })
  })

  it("should convert array field to descriptor", () => {
    const field: Field = {
      name: "tags",
      type: "array",
      constraints: {
        jsonSchema: {
          type: "array",
          items: { type: "string" },
        },
      },
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("tags")
    expect(result.type).toBe("array")
    expect((result.constraints as any)?.jsonSchema).toEqual({
      type: "array",
      items: { type: "string" },
    })
  })

  it("should preserve string field with categories", () => {
    const field: Field = {
      name: "status",
      type: "string",
      categories: ["active", "inactive", "pending"],
      categoriesOrdered: true,
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("status")
    expect(result.type).toBe("string")
    expect(result.categories).toEqual(["active", "inactive", "pending"])
    expect(result.categoriesOrdered).toBe(true)
  })

  it("should preserve field with missingValues", () => {
    const field: Field = {
      name: "value",
      type: "string",
      missingValues: ["", "NA", "N/A"],
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("value")
    expect(result.type).toBe("string")
    expect(result.missingValues).toEqual(["", "NA", "N/A"])
  })

  it("should preserve field with example and examples", () => {
    const field: Field = {
      name: "age",
      type: "integer",
      example: 25,
      examples: [18, 25, 30, 45],
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("age")
    expect(result.type).toBe("integer")
    expect(result.example).toBe(25)
    expect(result.examples).toEqual([18, 25, 30, 45])
  })

  it("should preserve field with rdfType", () => {
    const field: Field = {
      name: "age",
      type: "integer",
      rdfType: "http://schema.org/age",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("age")
    expect(result.type).toBe("integer")
    expect(result.rdfType).toBe("http://schema.org/age")
  })

  it("should convert field with all properties", () => {
    const field: Field = {
      name: "email",
      type: "string",
      format: "email",
      title: "Email Address",
      description: "User's email address",
      example: "user@example.com",
      examples: ["user@example.com", "admin@example.org"],
      rdfType: "http://schema.org/email",
      missingValues: ["", "none"],
      categories: ["personal", "work"],
      categoriesOrdered: false,
      constraints: {
        required: true,
        pattern: "^[a-z]+@[a-z]+\\.[a-z]+$",
      },
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("email")
    expect(result.type).toBe("string")
    expect(result.format).toBe("email")
    expect(result.title).toBe("Email Address")
    expect(result.description).toBe("User's email address")
    expect(result.example).toBe("user@example.com")
    expect(result.examples).toEqual(["user@example.com", "admin@example.org"])
    expect(result.rdfType).toBe("http://schema.org/email")
    expect(result.missingValues).toEqual(["", "none"])
    expect(result.categories).toEqual(["personal", "work"])
    expect(result.categoriesOrdered).toBe(false)
    expect(result.constraints).toEqual({
      required: true,
      pattern: "^[a-z]+@[a-z]+\\.[a-z]+$",
    })
  })

  it("should convert year field to descriptor", () => {
    const field: Field = {
      name: "birth_year",
      type: "year",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("birth_year")
    expect(result.type).toBe("year")
  })

  it("should convert yearmonth field to descriptor", () => {
    const field: Field = {
      name: "start_month",
      type: "yearmonth",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("start_month")
    expect(result.type).toBe("yearmonth")
  })

  it("should convert duration field to descriptor", () => {
    const field: Field = {
      name: "duration",
      type: "duration",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("duration")
    expect(result.type).toBe("duration")
  })

  it("should convert geopoint field to descriptor", () => {
    const field: Field = {
      name: "location",
      type: "geopoint",
      format: "default",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("location")
    expect(result.type).toBe("geopoint")
    expect(result.format).toBe("default")
  })

  it("should convert geojson field to descriptor", () => {
    const field: Field = {
      name: "geometry",
      type: "geojson",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("geometry")
    expect(result.type).toBe("geojson")
  })

  it("should convert any field to descriptor", () => {
    const field: Field = {
      name: "data",
      type: "any",
    }

    const result = convertFieldToDescriptor(field)

    expect(result.name).toBe("data")
    expect(result.type).toBe("any")
  })
})
