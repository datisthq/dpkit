import type {
  DataError,
  FileError,
  MetadataError,
  TableError,
} from "@dpkit/lib"
import * as pl from "nodejs-polars"
import React from "react"
import { TableGrid } from "./TableGrid.tsx"

export function ErrorGrid(props: {
  errors: (TableError | DataError | MetadataError | FileError)[]
  quit?: boolean
}) {
  // TODO: Property process errors
  const errors = props.errors.map(error => ({
    ...error,
    // @ts-ignore
    params: error.params ? error.params.toString() : undefined,
  }))

  const table = pl.DataFrame(errors).lazy()

  return <TableGrid borderColor="red" table={table} quit={props.quit} />
}
