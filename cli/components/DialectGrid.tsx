import type { Dialect } from "dpkit"
import React from "react"
import { DataGrid } from "./DataGrid.tsx"

export function DialectGrid(props: { dialect: Dialect }) {
  return <DataGrid data={[props.dialect]} />
}
