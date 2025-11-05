import type { Resource } from "@dpkit/library"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support better display of resource properties

export function ResourceGrid(props: { resource: Resource }) {
  const { dialect, schema, ...record } = props.resource

  return <DataGrid records={[record]} />
}
