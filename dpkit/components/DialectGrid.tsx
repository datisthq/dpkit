import type { Dialect } from "@dpkit/all"
import type { DataRecord } from "@dpkit/all"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support non-visible chars like TAB and CR

export function DialectGrid(props: { dialect: Dialect }) {
  const records = [props.dialect as DataRecord]

  return <DataGrid records={records} />
}
