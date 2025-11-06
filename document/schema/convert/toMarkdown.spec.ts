import type { Schema } from "@dpkit/metadata"
import { describe, expect, it } from "vitest"
import { convertSchemaToMarkdown } from "./toMarkdown.ts"

describe("convertSchemaToMarkdown", () => {
  it("converts a simple schema to markdown table", () => {
    const schema: Schema = {
      fields: [
        {
          name: "id",
          type: "integer",
          title: "Identifier",
          description: "Unique identifier",
        },
        {
          name: "name",
          type: "string",
          title: "Name",
          description: "Person name",
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain(
      "| Name | Type | Title | Description | Constraints |",
    )
    expect(result).toContain(
      "| id | integer | Identifier | Unique identifier |",
    )
    expect(result).toContain("| name | string | Name | Person name |")
  })

  it("includes schema title and description", () => {
    const schema: Schema = {
      title: "Test Schema",
      description: "A test schema for validation",
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain("# Test Schema")
    expect(result).toContain("A test schema for validation")
  })

  it("handles field constraints", () => {
    const schema: Schema = {
      fields: [
        {
          name: "age",
          type: "integer",
          constraints: {
            required: true,
            minimum: 0,
            maximum: 120,
          },
        },
        {
          name: "email",
          type: "string",
          constraints: {
            required: true,
            pattern: "^[a-z]+@[a-z]+\\.[a-z]+$",
          },
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain("required")
    expect(result).toContain("min: 0")
    expect(result).toContain("max: 120")
    expect(result).toContain("pattern:")
  })

  it("handles empty fields array", () => {
    const schema: Schema = {
      fields: [],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain(
      "| Name | Type | Title | Description | Constraints |",
    )
  })

  it("handles pipe characters in field values", () => {
    const schema: Schema = {
      fields: [
        {
          name: "field",
          type: "string",
          description: "Description with pipe character",
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain("Description with pipe character")
  })

  it("handles fields with enum constraints", () => {
    const schema: Schema = {
      fields: [
        {
          name: "status",
          type: "string",
          constraints: {
            enum: ["active", "inactive", "pending"],
          },
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema)

    expect(result).toContain("enum: active, inactive, pending")
  })

  it("uses frontmatter when frontmatter option is true", () => {
    const schema: Schema = {
      title: "Test Schema",
      description: "A test schema with frontmatter",
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema, { frontmatter: true })

    expect(result).toContain("---")
    expect(result).toContain("title: Test Schema")
    expect(result).not.toContain("# Test Schema")
    expect(result).toContain("A test schema with frontmatter")
  })

  it("uses H1 heading when frontmatter option is false or not provided", () => {
    const schema: Schema = {
      title: "Test Schema",
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToMarkdown(schema, { frontmatter: false })

    expect(result).toContain("# Test Schema")
    expect(result).not.toContain("title: Test Schema")
    expect(result.startsWith("# Test Schema")).toBe(true)
  })
})
