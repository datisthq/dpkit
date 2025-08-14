import type { Package } from "dpkit"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support showing other package/resource properties

export function PackageGrid(props: { schema: Package }) {
  const data = [
    Object.fromEntries(
      props.schema.resources.map(resource => [resource.name, resource.path]),
    ),
  ]

  return <DataGrid data={data} />
}
