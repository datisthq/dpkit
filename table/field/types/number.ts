import type { NumberField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseNumberField(field: NumberField, expr?: Expr) {
  expr = expr ?? col(field.name)
  expr = expr.str.strip()

  // Extract the decimal and group characters
  const decimalChar = field.decimalChar || "."
  const groupChar = field.groupChar || ""

  // Handle non-bare numbers (with currency symbols, percent signs, etc.)
  if (field.bareNumber === false) {
    // Remove leading non-digit characters (except minus sign and allowed decimal points)
    const allowedDecimalChars =
      decimalChar === "." ? "\\." : `\\.${decimalChar}`
    expr = expr.str.replaceAll(`^[^\\d\\-${allowedDecimalChars}]+`, "")
    // Remove trailing non-digit characters
    expr = expr.str.replaceAll(`[^\\d${allowedDecimalChars}]+$`, "")
  }

  // Special case handling for European number format where "." is group and "," is decimal
  if (groupChar === "." && decimalChar === ",") {
    // First temporarily replace the decimal comma with a placeholder
    expr = expr.str.replaceAll(",", "###DECIMAL###")
    // Remove the group dots
    expr = expr.str.replaceAll("\\.", "")
    // Replace the placeholder with an actual decimal point
    expr = expr.str.replaceAll("###DECIMAL###", ".")
  } else {
    // Standard case: first remove group characters
    if (groupChar) {
      // Escape special characters for regex
      const escapedGroupChar = groupChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      expr = expr.str.replaceAll(escapedGroupChar, "")
    }

    // Then handle decimal character
    if (decimalChar && decimalChar !== ".") {
      expr = expr.str.replaceAll(decimalChar, ".")
    }
  }

  // Cast to float64
  expr = expr.cast(DataType.Float64)
  return expr
}
