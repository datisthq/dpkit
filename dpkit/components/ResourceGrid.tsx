import type { Resource } from "@dpkit/all"
import type { DataRecord } from "@dpkit/all"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support better display of resource properties

export function ResourceGrid(props: { resource: Resource }) {
  const records = [props.resource as unknown as DataRecord]

  return <DataGrid records={records} />
}
