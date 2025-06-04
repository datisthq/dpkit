import type { BooleanField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Column } from "../Column.js"

const DEFAULT_TRUE_VALUES = ["true", "True", "TRUE", "1"]
const DEFAULT_FALSE_VALUES = ["false", "False", "FALSE", "0"]

export function parseBooleanColumn(props: {
  column: Column
  field: BooleanField
}) {
  let { column, field } = props

  if (column.dtype.equals(DataType.String)) {
    const trueValues = field.trueValues || DEFAULT_TRUE_VALUES
    const falseValues = field.falseValues || DEFAULT_FALSE_VALUES
    trueValues
    falseValues

    column = column.cast(DataType.Bool)
  }

  return column
}
