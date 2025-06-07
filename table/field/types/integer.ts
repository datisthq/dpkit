import type { IntegerField } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO: support categories
export function parseIntegerField(
  field: IntegerField,
  options?: {
    expr?: Expr
  },
) {
  let expr = options?.expr ?? col(field.name)

  // First, trim whitespace
  expr = expr.str.strip()

  // Handle non-bare numbers (with currency symbols, percent signs, etc.)
  if (field.bareNumber === false) {
    // Preserve the minus sign when removing leading characters
    expr = expr.str.replaceAll("^[^\\d\\-]+", "")
    expr = expr.str.replaceAll("[^\\d\\-]+$", "")
  }

  // Handle group character (thousands separator)
  if (field.groupChar) {
    // Escape special characters for regex
    const escapedGroupChar = field.groupChar.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    )
    expr = expr.str.replaceAll(escapedGroupChar, "")
  }

  // Cast to int64 (will handle values up to 2^63-1)
  expr = expr.cast(DataType.Int64)
  return expr
}
