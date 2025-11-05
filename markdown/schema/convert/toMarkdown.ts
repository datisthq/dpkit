import type { Schema } from "@dpkit/metadata"

export function convertSchemaToMarkdown(
  schema: Schema,
  options?: { frontmatter?: boolean },
): string {
  const rows: string[] = []

  rows.push("")
  rows.push("## Fields")
  rows.push("")
  rows.push("| Name | Type | Title | Description | Constraints |")
  rows.push("|------|------|-------|-------------|-------------|")

  for (const field of schema.fields) {
    const name = field.name || ""
    const type = field.type || "any"
    const title = field.title || ""
    const description = field.description || ""

    const constraints: string[] = []
    if ("required" in field && field.required) {
      constraints.push("required")
    }
    if ("constraints" in field && field.constraints) {
      const c = field.constraints as any
      if (c.required) constraints.push("required")
      if (c.unique) constraints.push("unique")
      if (c.minimum !== undefined) constraints.push(`min: ${c.minimum}`)
      if (c.maximum !== undefined) constraints.push(`max: ${c.maximum}`)
      if (c.minLength !== undefined)
        constraints.push(`minLength: ${c.minLength}`)
      if (c.maxLength !== undefined)
        constraints.push(`maxLength: ${c.maxLength}`)
      if (c.pattern) constraints.push(`pattern: ${c.pattern}`)
      if (c.enum) constraints.push(`enum: ${c.enum.join(", ")}`)
    }

    const constraintsStr = constraints.join(", ")

    const escapedName = escapeMarkdown(name)
    const escapedTitle = escapeMarkdown(title)
    const escapedDescription = escapeMarkdown(description)
    const escapedConstraints = escapeMarkdown(constraintsStr)

    rows.push(
      `| ${escapedName} | ${type} | ${escapedTitle} | ${escapedDescription} | ${escapedConstraints} |`,
    )
  }

  let markdown = `${rows.join("\n")}\n`

  if (schema.title || schema.description) {
    const header: string[] = []

    if (options?.frontmatter) {
      header.push("---")
      if (schema.title) {
        header.push(`title: ${schema.title}`)
      }
      header.push("---")
      header.push("")

      if (schema.description) {
        header.push(schema.description)
        header.push("")
      }
    } else {
      if (schema.title) {
        header.push(`# ${schema.title}`)
        header.push("")
      }

      if (schema.description) {
        header.push(schema.description)
        header.push("")
      }
    }

    markdown = header.join("\n") + markdown
  }

  return markdown
}

function escapeMarkdown(text: string): string {
  return text.replace(/\n/g, " ")
}
