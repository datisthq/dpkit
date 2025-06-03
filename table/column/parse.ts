import type { Field } from "@dpkit/core"
import type { Column } from "./Column.js"
import { parseIntegerColumn } from "./types/integer.js"

export function parseColumn(props: { column: Column; field: Field }) {
  const { column, field } = props

  switch (field.type) {
    case "integer":
      return parseIntegerColumn({ column, field })

    default:
      return column
  }
}
