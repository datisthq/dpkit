import type { IntegerField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Column } from "../Column.js"

/**
 * Parse a column of integer values according to the field configuration
 */
export function parseIntegerColumn(props: {
  column: Column
  field: IntegerField
}) {
  let { column, field } = props

  if (column.dtype.equals(DataType.String)) {
    // First, trim whitespace
    column = column.str.strip()

    // Handle non-bare numbers (with currency symbols, percent signs, etc.)
    if (field.bareNumber === false) {
      // Preserve the minus sign when removing leading characters
      column = column.str.replaceAll("^[^\\d\\-]+", "")
      column = column.str.replaceAll("[^\\d\\-]+$", "")
    }

    // Handle group character (thousands separator)
    if (field.groupChar) {
      // Escape special characters for regex
      const escapedGroupChar = field.groupChar.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      )
      column = column.str.replaceAll(escapedGroupChar, "")
    }

    // Cast to int64 (will handle values up to 2^63-1)
    column = column.cast(DataType.Int64)
  }

  return column
}
