import type { GeopointField } from "@dpkit/core"
import * as pl from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are within -180..180 and -90..90
// - Return null instead of list if any of the values are out of range

export function parseGeopointField(field: GeopointField, fieldExpr: pl.Expr) {
  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    fieldExpr = fieldExpr.str
      .split(",")
      .cast(pl.List(pl.Float64))
  }

  if (format === "array") {
    fieldExpr = fieldExpr.str
      .replaceAll("[\\[\\]\\s]", "")
      .str.split(",")
      .cast(pl.List(pl.Float64))
  }

  if (format === "object") {
    fieldExpr = pl
      .concatList([
        fieldExpr.str.jsonPathMatch("$.lon").cast(pl.Float64),
        fieldExpr.str.jsonPathMatch("$.lat").cast(pl.Float64),
      ])
      .alias(field.name)
  }

  return fieldExpr
}

export function stringifyGeopointField(
  field: GeopointField,
  fieldExpr: pl.Expr,
) {
  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    return fieldExpr.cast(pl.List(pl.String)).lst.join(",")
  }

  if (format === "array") {
    return pl
      .concatString(
        [
          pl.lit("["),
          fieldExpr.lst.get(0).cast(pl.String),
          pl.lit(","),
          fieldExpr.lst.get(1).cast(pl.String),
          pl.lit("]"),
        ],
        "",
      )
      .alias(field.name) as pl.Expr
  }

  if (format === "object") {
    return pl
      .concatString(
        [
          pl.lit('{"lon":'),
          fieldExpr.lst.get(0).cast(pl.String),
          pl.lit(',"lat":'),
          fieldExpr.lst.get(1).cast(pl.String),
          pl.lit("}"),
        ],
        "",
      )
      .alias(field.name) as pl.Expr
  }

  return fieldExpr
}
