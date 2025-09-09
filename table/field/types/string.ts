import type { StringField } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Validate regex if format provided and it can be performant (e.g. uuid)
// - Validate categories
// TODO: support categoriesOrder
export function parseStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  if (field.categories) {
    expr = expr.cast(DataType.Categorical)
  }

  return expr
}

export function stringifyStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  return expr
}
