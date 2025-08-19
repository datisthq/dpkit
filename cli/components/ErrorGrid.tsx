//import type { TableError } from "dpkit"
import { countBy } from "es-toolkit"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"
import { TableGrid } from "./TableGrid.tsx"

// TODO: Improve implementation (esp. typing)

export function ErrorGrid(props: {
  errors: Record<string, any>[]
  groupBy?: "type" | "resource"
}) {
  if (props.groupBy === "resource") {
    const groups = countBy(props.errors, error => error.resource)
    const data = Object.entries(groups).map(([resource, count]) => ({
      resource,
      count,
    }))

    return <DataGrid data={data} borderColor="red" />
  }

  if (props.groupBy === "type") {
    const groups = countBy(props.errors, error => error.type)
    const data = Object.entries(groups).map(([error, count]) => ({
      error,
      count,
    }))

    return <DataGrid data={data} borderColor="red" />
  }

  const table = DataFrame(props.errors).lazy()
  return <TableGrid table={table} borderColor="red" />
}
