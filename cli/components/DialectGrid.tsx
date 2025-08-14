import type { Dialect } from "dpkit"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

// TODO: Support non-visible chars like TAB and CR

export function DialectGrid(props: { dialect: Dialect }) {
  return <DataGrid data={[props.dialect]} />
}
