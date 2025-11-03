import type { NumberField } from "@dpkit/core"
import * as pl from "nodejs-polars"

export function parseNumberField(field: NumberField, fieldExpr: pl.Expr) {
  // Extract the decimal and group characters
  const decimalChar = field.decimalChar ?? "."
  const groupChar = field.groupChar ?? ""
  const bareNumber = field.bareNumber ?? true

  // Handle non-bare numbers (with currency symbols, percent signs, etc.)
  if (bareNumber === false) {
    // Remove leading non-digit characters (except minus sign and allowed decimal points)
    const allowedDecimalChars =
      decimalChar === "." ? "\\." : `\\.${decimalChar}`
    fieldExpr = fieldExpr.str.replaceAll(
      `^[^\\d\\-${allowedDecimalChars}]+`,
      "",
    )
    // Remove trailing non-digit characters
    fieldExpr = fieldExpr.str.replaceAll(`[^\\d${allowedDecimalChars}]+$`, "")
  }

  // Special case handling for European number format where "." is group and "," is decimal
  if (groupChar === "." && decimalChar === ",") {
    // First temporarily replace the decimal comma with a placeholder
    fieldExpr = fieldExpr.str.replaceAll(",", "###DECIMAL###")
    // Remove the group dots
    fieldExpr = fieldExpr.str.replaceAll("\\.", "")
    // Replace the placeholder with an actual decimal point
    fieldExpr = fieldExpr.str.replaceAll("###DECIMAL###", ".")
  } else {
    // Standard case: first remove group characters
    if (groupChar) {
      // Escape special characters for regex
      const escapedGroupChar = groupChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      fieldExpr = fieldExpr.str.replaceAll(escapedGroupChar, "")
    }

    // Then handle decimal character
    if (decimalChar && decimalChar !== ".") {
      fieldExpr = fieldExpr.str.replaceAll(decimalChar, ".")
    }
  }

  // Cast to float64
  fieldExpr = fieldExpr.cast(pl.DataType.Float64)
  return fieldExpr
}

export function stringifyNumberField(_field: NumberField, fieldExpr: pl.Expr) {
  // Convert to string
  fieldExpr = fieldExpr.cast(pl.DataType.String)

  //const decimalChar = field.decimalChar ?? "."
  //const groupChar = field.groupChar ?? ""

  // TODO: Add decimal character formatting when needed
  // TODO: Add group character formatting (thousands separator) when needed
  // TODO: Add non-bare number formatting (currency symbols, etc.) when needed

  return fieldExpr
}
