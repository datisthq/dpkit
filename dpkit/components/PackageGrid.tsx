import type { Package } from "dpkit"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support showing other package/resource properties

export function PackageGrid(props: { dataPackage: Package }) {
  const data = [
    Object.fromEntries(
      props.dataPackage.resources.map(resource => [
        resource.name,
        resource.path,
      ]),
    ),
  ]

  return <DataGrid data={data} />
}
