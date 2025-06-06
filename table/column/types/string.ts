import type { StringField } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Validate regex if format provided and it can be performant (e.g. uuid)
// - Validate categories
export function parseStringColumn(
  field: StringField,
  options?: { expr?: Expr },
) {
  let expr = options?.expr ?? col(field.name)

  // Trim whitespace
  expr = expr.str.strip()

  if (field.categories) {
    expr = expr.cast(DataType.Categorical)
  }

  return expr
}
