import type { Schema } from "@dpkit/core"

export function convertSchemaToHtml(
  schema: Schema,
  options?: { frontmatter?: boolean },
): string {
  const parts: string[] = []

  if (schema.title || schema.description) {
    if (options?.frontmatter) {
      parts.push("---")
      if (schema.title) {
        parts.push(`title: ${schema.title}`)
      }
      parts.push("---")
      parts.push("")

      if (schema.description) {
        parts.push(`<p>${escapeHtml(schema.description)}</p>`)
      }
    } else {
      if (schema.title) {
        const titleId = sanitizeId(schema.title)
        parts.push(
          `<h1 id="${escapeHtml(titleId)}">${escapeHtml(schema.title)}</h1>`,
        )
      }

      if (schema.description) {
        parts.push(`<p>${escapeHtml(schema.description)}</p>`)
      }
    }
  }

  parts.push("<h2>Fields</h2>")
  parts.push("")
  parts.push("<table>")
  parts.push("  <colgroup>")
  parts.push('    <col width="25%">')
  parts.push('    <col width="65%">')
  parts.push('    <col width="10%">')
  parts.push("  </colgroup>")
  parts.push("  <thead>")
  parts.push("    <tr>")
  parts.push("      <th>Name</th>")
  parts.push("      <th>Definition</th>")
  parts.push("      <th>Type</th>")
  parts.push("    </tr>")
  parts.push("  </thead>")
  parts.push("  <tbody>")

  for (const field of schema.fields) {
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

    parts.push("    <tr>")
    parts.push(`      <td id="${escapeHtml(sanitizeId(fieldName))}">`)
    parts.push(`        <code>${escapeHtml(fieldName)}</code>`)
    if (isRequired) {
      parts.push("        *")
    }
    parts.push("      </td>")
    parts.push("      <td>")

    if (fieldDescription) {
      parts.push(`        <p>${escapeHtml(fieldDescription)}</p>`)
    }

    const constraintsList: string[] = []
    if ("constraints" in field && field.constraints) {
      const c = field.constraints as any
      if (c.required) {
        constraintsList.push("          <li>required: <code>true</code></li>")
      }
      if (c.unique) {
        constraintsList.push("          <li>unique: <code>true</code></li>")
      }
      if (c.minimum !== undefined) {
        constraintsList.push(
          `          <li>minimum: <code>${escapeHtml(String(c.minimum))}</code></li>`,
        )
      }
      if (c.maximum !== undefined) {
        constraintsList.push(
          `          <li>maximum: <code>${escapeHtml(String(c.maximum))}</code></li>`,
        )
      }
      if (c.minLength !== undefined) {
        constraintsList.push(
          `          <li>minLength: <code>${escapeHtml(String(c.minLength))}</code></li>`,
        )
      }
      if (c.maxLength !== undefined) {
        constraintsList.push(
          `          <li>maxLength: <code>${escapeHtml(String(c.maxLength))}</code></li>`,
        )
      }
      if (c.pattern) {
        constraintsList.push(
          `          <li>pattern: <code>${escapeHtml(c.pattern)}</code></li>`,
        )
      }
      if (c.enum) {
        const enumValues = c.enum
          .map((v: any) => escapeHtml(String(v)))
          .join(", ")
        constraintsList.push(
          `          <li>enum: <code>${enumValues}</code></li>`,
        )
      }
    }

    if (constraintsList.length > 0) {
      parts.push("        <strong>Constraints</strong>")
      parts.push("        <ul>")
      parts.push(...constraintsList)
      parts.push("        </ul>")
    }

    if ("example" in field && field.example !== undefined) {
      parts.push("        <p>")
      parts.push(
        `          <strong>Example</strong>: <code>${escapeHtml(String(field.example))}</code>`,
      )
      parts.push("        </p>")
    }

    parts.push("      </td>")
    parts.push(`      <td>${escapeHtml(fieldType)}</td>`)
    parts.push("    </tr>")
  }

  parts.push("  </tbody>")
  parts.push("</table>")

  return parts.join("\n")
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function sanitizeId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
