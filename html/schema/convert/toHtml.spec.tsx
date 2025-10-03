import type { Schema } from "@dpkit/core"
import { describe, expect, it } from "vitest"
import { convertSchemaToHtml } from "./toHtml.tsx"

describe("convertSchemaToHtml", () => {
  it("converts a simple schema to html table", () => {
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

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Fields</h2>")
    expect(result).toContain("<table>")
    expect(result).toContain("<th>Name</th>")
    expect(result).toContain("<th>Definition</th>")
    expect(result).toContain("<th>Type</th>")
    expect(result).toContain("<code>id</code>")
    expect(result).toContain("<code>name</code>")
    expect(result).toContain("<p>Unique identifier</p>")
    expect(result).toContain("<p>Person name</p>")
    expect(result).toContain("<td>integer</td>")
    expect(result).toContain("<td>string</td>")
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

    const result = convertSchemaToHtml(schema)

    expect(result).toContain('<h1 id="test-schema">Test Schema</h1>')
    expect(result).toContain("<p>A test schema for validation</p>")
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

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<strong>Constraints</strong>")
    expect(result).toContain("required:")
    expect(result).toContain("<code>true</code>")
    expect(result).toContain("minimum:")
    expect(result).toContain("<code>0</code>")
    expect(result).toContain("maximum:")
    expect(result).toContain("<code>120</code>")
    expect(result).toContain("pattern:")
  })

  it("handles required field indicator", () => {
    const schema: Schema = {
      fields: [
        {
          name: "requiredField",
          type: "string",
          constraints: {
            required: true,
          },
        },
        {
          name: "optionalField",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<code>requiredField</code>")
    expect(result).toContain("*")
    expect(result).toContain("<code>optionalField</code>")
  })

  it("handles empty fields array", () => {
    const schema: Schema = {
      fields: [],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Fields</h2>")
    expect(result).toContain("<table>")
    expect(result).toContain("</table>")
  })

  it("escapes HTML special characters", () => {
    const schema: Schema = {
      title: "Test & <Schema>",
      description: 'Description with "quotes" and <tags>',
      fields: [
        {
          name: "field",
          type: "string",
          description: "Description with <script>alert('xss')</script>",
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("Test &amp; &lt;Schema&gt;")
    expect(result).toContain(
      "Description with &quot;quotes&quot; and &lt;tags&gt;",
    )
    expect(result).toContain(
      "Description with &lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;",
    )
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

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("enum:")
    expect(result).toContain("<code>active, inactive, pending</code>")
  })

  it("handles multiple constraint types", () => {
    const schema: Schema = {
      fields: [
        {
          name: "username",
          type: "string",
          constraints: {
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 20,
            pattern: "^[a-zA-Z0-9_]+$",
          },
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("required:")
    expect(result).toContain("unique:")
    expect(result).toContain("minLength:")
    expect(result).toContain("<code>3</code>")
    expect(result).toContain("maxLength:")
    expect(result).toContain("<code>20</code>")
    expect(result).toContain("pattern:")
  })

  it("handles field examples", () => {
    const schema: Schema = {
      fields: [
        {
          name: "email",
          type: "string",
          example: "user@example.com",
        },
        {
          name: "age",
          type: "integer",
          example: 25,
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<strong>Example</strong>")
    expect(result).toContain("<code>user@example.com</code>")
    expect(result).toContain("<code>25</code>")
  })

  it("handles different field types", () => {
    const schema: Schema = {
      fields: [
        { name: "field1", type: "string" },
        { name: "field2", type: "integer" },
        { name: "field3", type: "number" },
        { name: "field4", type: "boolean" },
        { name: "field5", type: "datetime" },
        { name: "field6", type: "any" },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<td>string</td>")
    expect(result).toContain("<td>integer</td>")
    expect(result).toContain("<td>number</td>")
    expect(result).toContain("<td>boolean</td>")
    expect(result).toContain("<td>datetime</td>")
    expect(result).toContain("<td>any</td>")
  })

  it("sanitizes IDs for anchors", () => {
    const schema: Schema = {
      title: "Test Schema & More!",
      fields: [
        {
          name: "field-with-dashes",
          type: "string",
        },
        {
          name: "Field With Spaces",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain('id="test-schema-more"')
    expect(result).toContain('id="field-with-dashes"')
    expect(result).toContain('id="field-with-spaces"')
  })

  it("does not include top-level html tags", () => {
    const schema: Schema = {
      title: "Test",
      fields: [{ name: "field1", type: "string" }],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).not.toContain("<!DOCTYPE")
    expect(result).not.toContain("<html>")
    expect(result).not.toContain("<head>")
    expect(result).not.toContain("<body>")
    expect(result).not.toContain("<style>")
  })

  it("handles schema without title", () => {
    const schema: Schema = {
      description: "Description only",
      fields: [{ name: "field1", type: "string" }],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<p>Description only</p>")
    expect(result).not.toContain("<h2 id=")
    expect(result).toContain("<h2>Fields</h2>")
  })

  it("handles field without description", () => {
    const schema: Schema = {
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<code>field1</code>")
    expect(result).toContain("<td>string</td>")
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

    const result = convertSchemaToHtml(schema, { frontmatter: true })

    expect(result).toContain("---")
    expect(result).toContain("Test Schema")
    expect(result).not.toContain("<h1")
    expect(result).toContain("<p>A test schema with frontmatter</p>")
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

    const result = convertSchemaToHtml(schema, { frontmatter: false })

    expect(result).toContain('<h1 id="test-schema">Test Schema</h1>')
    expect(result).not.toContain("title: Test Schema")
    expect(result.startsWith("<h1")).toBe(true)
  })
})
