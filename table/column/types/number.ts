import type { NumberField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { Column } from "../Column.js"

/**
 * Parse a column of number values according to the field configuration
 */
export function parseNumberColumn(props: {
  column: Column
  field: NumberField
}) {
  let { column, field } = props

  if (column.dtype.equals(DataType.String)) {
    // Extract the decimal and group characters
    const decimalChar = field.decimalChar || "."
    const groupChar = field.groupChar || ""
    
    // Handle non-bare numbers (with currency symbols, percent signs, etc.)
    if (field.bareNumber === false) {
      // Remove leading non-digit characters (except minus sign and allowed decimal points)
      const allowedDecimalChars = decimalChar === "." ? "\\." : `\\.${decimalChar}`
      column = column.str.replaceAll(`^[^\\d\\-${allowedDecimalChars}]+`, "")
      // Remove trailing non-digit characters
      column = column.str.replaceAll(`[^\\d${allowedDecimalChars}]+$`, "")
    }

    // Special case handling for European number format where "." is group and "," is decimal
    if (groupChar === "." && decimalChar === ",") {
      // First temporarily replace the decimal comma with a placeholder
      column = column.str.replaceAll(",", "###DECIMAL###")
      // Remove the group dots
      column = column.str.replaceAll("\\.", "")
      // Replace the placeholder with an actual decimal point
      column = column.str.replaceAll("###DECIMAL###", ".")
    } else {
      // Standard case: first remove group characters
      if (groupChar) {
        // Escape special characters for regex
        const escapedGroupChar = groupChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        column = column.str.replaceAll(escapedGroupChar, "")
      }
      
      // Then handle decimal character
      if (decimalChar && decimalChar !== ".") {
        column = column.str.replaceAll(decimalChar, ".")
      }
    }

    // Cast to float64
    column = column.cast(DataType.Float64)
  }

  return column
}