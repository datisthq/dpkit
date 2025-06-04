import type { Field } from "@dpkit/core"
import type { Column } from "./Column.js"
import { parseBooleanColumn } from "./types/boolean.js"
import { parseIntegerColumn } from "./types/integer.js"
import { parseNumberColumn } from "./types/number.js"

export function parseColumn(props: { column: Column; field: Field }) {
  const { column, field } = props

  switch (field.type) {
    case "integer":
      return parseIntegerColumn({ column, field })

    case "number":
      return parseNumberColumn({ column, field })

    case "boolean":
      return parseBooleanColumn({ column, field })

    default:
      return column
  }
}
