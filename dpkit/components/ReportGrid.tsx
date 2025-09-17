import { DataFrame } from "nodejs-polars"
import React from "react"
import { countBy } from "../helpers/object.ts"
import { DataGrid } from "./DataGrid.tsx"
import { TableGrid } from "./TableGrid.tsx"

// TODO: Improve implementation (esp. typing)

export function ReportGrid(props: {
  report: { valid: boolean; errors: Record<string, any>[] }
  groupBy?: "type" | "resource/type"
}) {
  const { report, groupBy } = props

  if (report.valid) {
    return null
  }

  if (groupBy === "resource/type") {
    const groups = countBy(report.errors, error =>
      [error.resource ?? "", error.type].join("/"),
    )

    const records = Object.entries(groups).map(([resourceType, count]) => ({
      resource: resourceType.split("/")[0],
      type: resourceType.split("/")[1],
      count,
    }))

    return <DataGrid borderColor="red" records={records} />
  }

  if (groupBy === "type") {
    const groups = countBy(report.errors, error => error.type)
    const records = Object.entries(groups).map(([error, count]) => ({
      error,
      count,
    }))

    return <DataGrid borderColor="red" records={records} />
  }

  const table = DataFrame(report.errors).lazy()
  return <TableGrid borderColor="red" table={table} />
}
