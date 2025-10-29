import type { IntegerField } from "@dpkit/core"
import { DataType, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: support categories
// TODO: support categoriesOrder
export function parseIntegerField(field: IntegerField, fieldExpr: Expr) {
  const groupChar = field.groupChar
  const bareNumber = field.bareNumber
  const flattenCategories = field.categories?.map(it =>
    typeof it === "number" ? it : it.value,
  )

  // Handle non-bare numbers (with currency symbols, percent signs, etc.)
  if (bareNumber === false) {
    // Preserve the minus sign when removing leading characters
    fieldExpr = fieldExpr.str.replaceAll("^[^\\d\\-]+", "")
    fieldExpr = fieldExpr.str.replaceAll("[^\\d\\-]+$", "")
  }

  // Handle group character (thousands separator)
  if (groupChar) {
    // Escape special characters for regex
    const escapedGroupChar = groupChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    fieldExpr = fieldExpr.str.replaceAll(escapedGroupChar, "")
  }

  // Cast to int64 (will handle values up to 2^63-1)
  fieldExpr = fieldExpr.cast(DataType.Int64)

  // Currently, only string categories are supported
  if (flattenCategories) {
    return when(fieldExpr.isIn(flattenCategories))
      .then(fieldExpr)
      .otherwise(lit(null))
      .alias(field.name)
  }

  return fieldExpr
}

export function stringifyIntegerField(_field: IntegerField, fieldExpr: Expr) {
  // Convert to string
  fieldExpr = fieldExpr.cast(DataType.String)

  //const groupChar = field.groupChar
  //const bareNumber = field.bareNumber

  // TODO: Add group character formatting (thousands separator) when needed
  // TODO: Add non-bare number formatting (currency symbols, etc.) when needed

  return fieldExpr
}
