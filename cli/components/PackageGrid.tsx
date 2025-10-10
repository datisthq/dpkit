import type { Package } from "@dpkit/lib"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support showing other package/resource properties

export function PackageGrid(props: { dataPackage: Package }) {
  const records = [
    Object.fromEntries(
      props.dataPackage.resources.map(resource => [
        resource.name,
        resource.path,
      ]),
    ),
  ]

  return <DataGrid records={records} />
}
