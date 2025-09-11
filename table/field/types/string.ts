import type { StringField } from "@dpkit/core"
import { DataType, col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

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

  return expr
}

export function stringifyStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  return expr
}
