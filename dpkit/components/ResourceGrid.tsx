import type { Resource } from "dpkit"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support better display of resource properties

export function ResourceGrid(props: { resource: Resource }) {
  const data = [props.resource]

  return <DataGrid data={data} />
}
