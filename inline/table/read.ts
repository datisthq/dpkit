import type { Resource } from "@dpkit/core"
import { processTable } from "@dpkit/table"
import { draftInlineTable } from "./draft.js"

export async function readInlineTable(props: { resource: Resource }) {
  const { resource } = props

  const table = await draftInlineTable({ resource })
  const schema = resource.schema

  return processTable({ table, schema })
}
