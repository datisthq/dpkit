import type * as library from "@dpkit/library"
import React from "react"
import { Datagrid } from "../Datagrid/index.ts"

// TODO: Support showing other schema/field properties

export function Schema(props: { schema: library.Schema }) {
  const records = [
    Object.fromEntries(
      props.schema.fields.map(field => [field.name, field.type]),
    ),
  ]

  return <Datagrid records={records} />
}
