import type { Schema } from "@dpkit/library"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support showing other schema/field properties

export function SchemaGrid(props: { schema: Schema }) {
  const records = [
    Object.fromEntries(
      props.schema.fields.map(field => [field.name, field.type]),
    ),
  ]

  return <DataGrid records={records} />
}
