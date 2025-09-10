import type { GeopointField } from "@dpkit/core"
import { DataType, col, concatList, concatString, lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are within -180..180 and -90..90
// - Return null instead of list if any of the values are out of range

export function parseGeopointField(field: GeopointField, expr?: Expr) {
  expr = expr ?? col(field.name)

  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    expr = expr.str.split(",").cast(DataType.List(DataType.Float64))
  }

  if (format === "array") {
    expr = expr.str
      .replaceAll("[\\[\\]\\s]", "")
      .str.split(",")
      .cast(DataType.List(DataType.Float64))
  }

  if (format === "object") {
    expr = concatList([
      expr.str.jsonPathMatch("$.lon").cast(DataType.Float64),
      expr.str.jsonPathMatch("$.lat").cast(DataType.Float64),
    ]).alias(field.name)
  }

  return expr
}

export function stringifyGeopointField(field: GeopointField, expr?: Expr) {
  expr = expr ?? col(field.name)

  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    return expr.cast(DataType.List(DataType.String)).lst.join(",")
  }

  if (format === "array") {
    return concatString(
      [
        lit("["),
        expr.lst.get(0).cast(DataType.String),
        lit(","),
        expr.lst.get(1).cast(DataType.String),
        lit("]"),
      ],
      "",
    ).alias(field.name) as Expr
  }

  if (format === "object") {
    return concatString(
      [
        lit('{"lon":'),
        expr.lst.get(0).cast(DataType.String),
        lit(',"lat":'),
        expr.lst.get(1).cast(DataType.String),
        lit("}"),
      ],
      "",
    ).alias(field.name) as Expr
  }

  return expr
}
