//import type { TableError } from "dpkit"
import { countBy } from "es-toolkit"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"
import { TableGrid } from "./TableGrid.tsx"

// TODO: Improve implementation (esp. typing)
// TODO: Rebase on resource/type grouping?

export function ReportGrid(props: {
  report: { valid: boolean; errors: Record<string, any>[] }
  groupBy?: "type" | "resource"
}) {
  const { report, groupBy } = props

  if (report.valid) {
    return null
  }

  if (groupBy === "resource") {
    const groups = countBy(report.errors, error => error.resource ?? "")
    const data = Object.entries(groups).map(([resource, count]) => ({
      resource,
      count,
    }))

    return <DataGrid data={data} borderColor="red" />
  }

  if (groupBy === "type") {
    const groups = countBy(report.errors, error => error.type)
    const data = Object.entries(groups).map(([error, count]) => ({
      error,
      count,
    }))

    return <DataGrid data={data} borderColor="red" />
  }

  const table = DataFrame(report.errors).lazy()
  return <TableGrid table={table} borderColor="red" />
}
