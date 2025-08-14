import type { TableError } from "dpkit"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { TableGrid } from "./TableGrid.tsx"

export function ErrorGrid(props: { errors: TableError[] }) {
  const table = DataFrame(props.errors).lazy()

  return <TableGrid table={table} />
}
