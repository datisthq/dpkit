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
    expect(result).toContain("<strong>id?</strong>")
    expect(result).toContain("<strong>name?</strong>")
    expect(result).toContain("<p>Unique identifier</p>")
    expect(result).toContain("<p>Person name</p>")
    expect(result).toContain("<code>integer</code>")
    expect(result).toContain("<code>string</code>")
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

    expect(result).toContain("<strong>requiredField</strong>")
    expect(result).not.toContain("requiredField?")
    expect(result).toContain("<strong>optionalField?</strong>")
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
          examples: ["user@example.com", "admin@test.org"],
        },
        {
          name: "age",
          type: "integer",
          examples: [25, 30],
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<strong>Examples</strong>")
    expect(result).toContain("<code>user@example.com</code>")
    expect(result).toContain("<code>admin@test.org</code>")
    expect(result).toContain("<code>25</code>")
    expect(result).toContain("<code>30</code>")
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

    expect(result).toContain("<code>string</code>")
    expect(result).toContain("<code>integer</code>")
    expect(result).toContain("<code>number</code>")
    expect(result).toContain("<code>boolean</code>")
    expect(result).toContain("<code>datetime</code>")
    expect(result).toContain("<code>any</code>")
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

    expect(result).toContain("<strong>field1?</strong>")
    expect(result).toContain("<code>string</code>")
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

  it("handles schema with primary key", () => {
    const schema: Schema = {
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

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Primary Key</h2>")
    expect(result).toContain("<code>id</code>")
  })

  it("handles schema with composite primary key", () => {
    const schema: Schema = {
      fields: [
        {
          name: "user_id",
          type: "integer",
        },
        {
          name: "project_id",
          type: "integer",
        },
      ],
      primaryKey: ["user_id", "project_id"],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Primary Key</h2>")
    expect(result).toContain("<code>user_id, project_id</code>")
  })

  it("handles schema with foreign keys", () => {
    const schema: Schema = {
      fields: [
        {
          name: "user_id",
          type: "integer",
        },
      ],
      foreignKeys: [
        {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Foreign Keys</h2>")
    expect(result).toContain("<th>Fields</th>")
    expect(result).toContain("<th>Reference Resource</th>")
    expect(result).toContain("<th>Reference Fields</th>")
    expect(result).toContain("<code>user_id</code>")
    expect(result).toContain("<code>users</code>")
    expect(result).toContain("<code>id</code>")
  })

  it("handles schema with multiple foreign keys", () => {
    const schema: Schema = {
      fields: [
        {
          name: "user_id",
          type: "integer",
        },
        {
          name: "project_id",
          type: "integer",
        },
      ],
      foreignKeys: [
        {
          fields: ["user_id"],
          reference: {
            resource: "users",
            fields: ["id"],
          },
        },
        {
          fields: ["project_id"],
          reference: {
            resource: "projects",
            fields: ["id"],
          },
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Foreign Keys</h2>")
    expect(result).toContain("<code>user_id</code>")
    expect(result).toContain("<code>users</code>")
    expect(result).toContain("<code>project_id</code>")
    expect(result).toContain("<code>projects</code>")
  })

  it("handles foreign key without resource specified", () => {
    const schema: Schema = {
      fields: [
        {
          name: "parent_id",
          type: "integer",
        },
      ],
      foreignKeys: [
        {
          fields: ["parent_id"],
          reference: {
            fields: ["id"],
          },
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).toContain("<h2>Foreign Keys</h2>")
    expect(result).toContain("<code>parent_id</code>")
    expect(result).toContain("<code>-</code>")
    expect(result).toContain("<code>id</code>")
  })

  it("does not render primary key or foreign keys sections when not present", () => {
    const schema: Schema = {
      fields: [
        {
          name: "field1",
          type: "string",
        },
      ],
    }

    const result = convertSchemaToHtml(schema)

    expect(result).not.toContain("<h2>Primary Key</h2>")
    expect(result).not.toContain("<h2>Foreign Keys</h2>")
  })
})
