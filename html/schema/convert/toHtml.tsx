import type { Field, Schema } from "@dpkit/core"
import { prettify } from "htmlfy"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

export function convertSchemaToHtml(
  schema: Schema,
  options?: { frontmatter?: boolean },
): string {
  let html = prettify(
    renderToStaticMarkup(
      <SchemaTable schema={schema} withTitle={!options?.frontmatter} />,
    ),
  )

  if (options?.frontmatter) {
    if (schema.title) {
      html = `---\ntitle: ${schema.title}\n---\n\n${html}`
    }
  }

  return html
}

function SchemaTable(props: { schema: Schema; withTitle?: boolean }) {
  const { schema, withTitle } = props
  const title = withTitle ? schema.title : undefined

  return (
    <>
      <SchemaHeader title={title} description={schema.description} />
      <FieldsTable fields={schema.fields} />
    </>
  )
}

function SchemaHeader(props: { title?: string; description?: string }) {
  const { title, description } = props

  return (
    <>
      {title && <h1 id={sanitizeId(title)}>{title}</h1>}
      {description && <p>{description}</p>}
    </>
  )
}

function FieldsTable(props: { fields: Field[] }) {
  const { fields } = props
  return (
    <>
      <h2>Fields</h2>
      <table>
        <colgroup>
          <col width="20%" />
          <col width="65%" />
          <col width="15%" />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Definition</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <FieldRow key={index} field={field} />
          ))}
        </tbody>
      </table>
    </>
  )
}

function FieldRow(props: { field: Field }) {
  const { field } = props
  const fieldName = field.name || ""
  const fieldType = field.type || "any"
  const fieldDescription = field.description || ""

  let isRequired = false
  if ("constraints" in field && field.constraints) {
    const c = field.constraints as any
    if (c.required) {
      isRequired = true
    }
  }

  const constraints = extractConstraints(field)

  return (
    <tr>
      <td id={sanitizeId(fieldName)}>
        <code>
          <strong>
            {fieldName}
            {!isRequired && "?"}
          </strong>
        </code>
      </td>
      <td>
        {fieldDescription && <p>{fieldDescription}</p>}
        {constraints.length > 0 && (
          <ConstraintsList constraints={constraints} />
        )}
        {field.example !== undefined && <Example value={field.example} />}
      </td>
      <td>
        <code>{fieldType}</code>
      </td>
    </tr>
  )
}

function ConstraintsList(props: { constraints: Constraint[] }) {
  const { constraints } = props
  return (
    <>
      <strong>Constraints</strong>
      <ul>
        {constraints.map((constraint, index) => (
          <li key={index}>
            {constraint.name}: <code>{constraint.value}</code>
          </li>
        ))}
      </ul>
    </>
  )
}

function Example(props: { value: any }) {
  const { value } = props
  return (
    <p>
      <strong>Example</strong>: <code>{String(value)}</code>
    </p>
  )
}

function extractConstraints(field: Field): Constraint[] {
  const constraints: Constraint[] = []

  if ("constraints" in field && field.constraints) {
    const c = field.constraints as any

    if (c.required) {
      constraints.push({ name: "required", value: "true" })
    }
    if (c.unique) {
      constraints.push({ name: "unique", value: "true" })
    }
    if (c.minimum !== undefined) {
      constraints.push({ name: "minimum", value: String(c.minimum) })
    }
    if (c.maximum !== undefined) {
      constraints.push({ name: "maximum", value: String(c.maximum) })
    }
    if (c.minLength !== undefined) {
      constraints.push({ name: "minLength", value: String(c.minLength) })
    }
    if (c.maxLength !== undefined) {
      constraints.push({ name: "maxLength", value: String(c.maxLength) })
    }
    if (c.pattern) {
      constraints.push({ name: "pattern", value: c.pattern })
    }
    if (c.enum) {
      const enumValues = c.enum.map((v: any) => String(v)).join(", ")
      constraints.push({ name: "enum", value: enumValues })
    }
  }

  return constraints
}

function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

interface Constraint {
  name: string
  value: string
}
