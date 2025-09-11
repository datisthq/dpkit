import type { StringField } from "@dpkit/core"
import { DataType, col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const FORMAT_REGEX = {
  email:
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$",
  uri: "^[a-zA-Z][a-zA-Z0-9+.-]*:(//([^\\s/]+[^\\s]*|/[^\\s]*)|[^\\s/][^\\s]*)$",
  binary: "^[A-Za-z0-9+/]*={0,2}$",
  uuid: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
} as const

// TODO: support categoriesOrder?
export function parseStringField(field: StringField, expr?: Expr) {
  expr = expr ?? col(field.name)

  const format = field.format
  const flattenCategories = field.categories?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  if (flattenCategories) {
    return when(expr.isIn(flattenCategories))
      .then(expr.cast(DataType.Categorical))
      .otherwise(lit(null))
      .alias(field.name)
  }

  if (format) {
    const regex = FORMAT_REGEX[format]
    return when(expr.str.contains(regex))
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
