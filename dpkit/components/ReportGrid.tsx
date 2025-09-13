import { DataFrame } from "nodejs-polars"
import React from "react"
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

// TODO: es-toolkit currently adds 12MB to the bundle size (tree-shaking?)
function countBy<T, K extends PropertyKey>(
  arr: readonly T[],
  mapper: (item: T) => K,
): Record<K, number> {
  const result = {} as Record<K, number>

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    // @ts-ignore
    const key = mapper(item)

    result[key] = (result[key] ?? 0) + 1
  }

  return result
}
