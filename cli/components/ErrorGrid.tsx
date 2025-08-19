//import type { TableError } from "dpkit"
import { countBy } from "es-toolkit"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"
import { TableGrid } from "./TableGrid.tsx"

// TODO: Improve implementation (esp. typing)

export function ErrorGrid(props: {
  errors: Record<string, any>[]
  byType?: boolean
}) {
  if (props.byType) {
    const errorsByType = countBy(props.errors, error => error.type)
    const data = Object.entries(errorsByType).map(([error, count]) => ({
      error,
      count,
    }))

    return <DataGrid data={data} borderColor="red" />
  }

  const table = DataFrame(props.errors).lazy()
  return <TableGrid table={table} borderColor="red" />
}
