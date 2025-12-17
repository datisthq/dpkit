import type * as library from "frictionless-ts"
import React from "react"
import { Datagrid } from "../Datagrid/index.ts"

// TODO: Support showing other package/resource properties

export function Package(props: { dataPackage: library.Package }) {
  const records = [
    Object.fromEntries(
      props.dataPackage.resources.map(resource => [
        resource.name,
        resource.path,
      ]),
    ),
  ]

  return <Datagrid records={records} />
}
