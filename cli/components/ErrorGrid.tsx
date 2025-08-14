//import type { TableError } from "dpkit"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { TableGrid } from "./TableGrid.tsx"

// TODO: Improve implementation (esp. typing)

export function ErrorGrid(props: { errors: Record<string, any>[] }) {
  const table = DataFrame(props.errors).lazy()

  return <TableGrid table={table} />
}
