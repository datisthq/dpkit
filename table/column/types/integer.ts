import type { IntegerField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Column } from "../Column.js"

export function parseIntegerColumn(props: {
  column: Column
  field: IntegerField
}) {
  let { column, field } = props

  if (column.dtype.equals(DataType.String)) {
    if (field.groupChar) {
      column = column.str.replaceAll(field.groupChar, "")
    }

    if (field.bareNumber === false) {
      column = column.str.replaceAll("^[^\\d]+", "")
      column = column.str.replaceAll("[^\\d]+$", "")
    }

    column = column.cast(DataType.Int64)
  }

  return column
}
