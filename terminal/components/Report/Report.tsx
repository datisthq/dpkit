import type { UnboundError } from "frictionless-ts"
import * as pl from "nodejs-polars"
import React from "react"
import { Table } from "../Table/index.ts"

export function Report(props: {
  errors: UnboundError[]
  quit?: boolean
}) {
  // TODO: Property process errors
  const errors = props.errors.map(error => ({
    ...error,
    // @ts-ignore
    params: error.params ? error.params.toString() : undefined,
  }))

  const table = pl.DataFrame(errors).lazy()

  return <Table borderColor="red" table={table} quit={props.quit} />
}
