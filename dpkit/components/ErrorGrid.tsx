import type { FileError, MetadataError, TableError } from "@dpkit/all"
import { DataFrame } from "nodejs-polars"
import React from "react"
import { TableGrid } from "./TableGrid.tsx"

export function ErrorGrid(props: {
  errors: (TableError | MetadataError | FileError)[]
  quit?: boolean
}) {
  const table = DataFrame(props.errors).lazy()

  return <TableGrid borderColor="red" table={table} quit={props.quit} />
}
