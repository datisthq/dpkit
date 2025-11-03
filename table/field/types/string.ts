import type { StringField } from "@dpkit/core"
import * as pl from "nodejs-polars"

const FORMAT_REGEX = {
  email:
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
  uri: "^[a-zA-Z][a-zA-Z0-9+.-]*:(//([^\\s/]+[^\\s]*|/[^\\s]*)|[^\\s/][^\\s]*)$",
  binary: "^[A-Za-z0-9+/]*={0,2}$",
  uuid: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
} as const

// TODO: support categoriesOrder?
export function parseStringField(field: StringField, fieldExpr: pl.Expr) {
  const format = field.format
  const flattenCategories = field.categories?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  if (flattenCategories) {
    return pl
      .when(fieldExpr.isIn(flattenCategories))
      .then(fieldExpr.cast(pl.DataType.Categorical))
      .otherwise(pl.lit(null))
      .alias(field.name)
  }

  if (format) {
    const regex = FORMAT_REGEX[format]
    return pl
      .when(fieldExpr.str.contains(regex))
      .then(fieldExpr)
      .otherwise(pl.lit(null))
      .alias(field.name)
  }

  return fieldExpr
}

export function stringifyStringField(_field: StringField, fieldExpr: pl.Expr) {
  return fieldExpr
}
