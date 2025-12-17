import type * as library from "frictionless-ts"
import type { DataRecord } from "frictionless-ts"
import React from "react"
import { Datagrid } from "../Datagrid/index.ts"

// TODO: Support non-visible chars like TAB and CR

export function Dialect(props: { dialect: library.Dialect }) {
  const records = [props.dialect as DataRecord]

  return <Datagrid records={records} />
}
