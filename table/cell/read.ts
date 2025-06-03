import type { Field } from "@dpkit/core"
import { Series } from "nodejs-polars"
import { convertFieldToPolars } from "../field/index.js"

export function readCell(props: { cell: unknown; field: Field }) {
  const { cell, field } = props

  const polarsField = convertFieldToPolars({ field })
  const polarsSeries = Series(polarsField.name, [cell], polarsField.type)

  const value = polarsSeries[0]
  return value
}
