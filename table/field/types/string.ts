import type { StringField } from "@dpkit/core"
import { DataType, col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const UUID_REGEX =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"

// TODO:
// Add more validation:
// - Validate regex if format provided and it can be performant (e.g. uuid)
// TODO: support categoriesOrder
export function parseStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  if (field.categories) {
    return when(expr.isIn(field.categories))
      .then(expr.cast(DataType.Categorical))
      .otherwise(lit(null))
      .alias(field.name)
  }

  if (field.format === "uuid") {
    return when(expr.str.contains(UUID_REGEX))
      .then(expr)
      .otherwise(lit(null))
      .alias(field.name)
  }

  return expr
}

export function stringifyStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  return expr
}
