import type * as library from "frictionless-ts"
import React from "react"
import { Datagrid } from "../Datagrid/index.ts"

// TODO: Support better display of resource properties

export function Resource(props: { resource: library.Resource }) {
  const { dialect, schema, ...record } = props.resource

  return <Datagrid records={[record]} />
}
