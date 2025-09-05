import type { IntegerField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

type IntegerFieldOptions = {
  groupChar?: string
  bareNumber?: boolean
}

// TODO: support categories
// TODO: support categoriesOrder
export function parseIntegerField(
  field: IntegerField,
  expr?: Expr,
  options?: IntegerFieldOptions,
) {
  expr = expr ?? col(field.name)

  const groupChar = field.groupChar ?? options?.groupChar
  const bareNumber = field.bareNumber ?? options?.bareNumber

  // Handle non-bare numbers (with currency symbols, percent signs, etc.)
  if (bareNumber === false) {
    // Preserve the minus sign when removing leading characters
    expr = expr.str.replaceAll("^[^\\d\\-]+", "")
    expr = expr.str.replaceAll("[^\\d\\-]+$", "")
  }

  // Handle group character (thousands separator)
  if (groupChar) {
    // Escape special characters for regex
    const escapedGroupChar = groupChar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    expr = expr.str.replaceAll(escapedGroupChar, "")
  }

  // Cast to int64 (will handle values up to 2^63-1)
  expr = expr.cast(DataType.Int64)
  return expr
}
