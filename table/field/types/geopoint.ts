import type { GeopointField } from "@dpkit/core"
import { DataType, concatList, concatString, lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

// TODO:
// Add more validation:
// - Check the length of the list is 2 (no list.lenghts in polars currently)
// - Check the values are within -180..180 and -90..90
// - Return null instead of list if any of the values are out of range

export function parseGeopointField(field: GeopointField, fieldExpr: Expr) {
  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    fieldExpr = fieldExpr.str.split(",").cast(DataType.List(DataType.Float64))
  }

  if (format === "array") {
    fieldExpr = fieldExpr.str
      .replaceAll("[\\[\\]\\s]", "")
      .str.split(",")
      .cast(DataType.List(DataType.Float64))
  }

  if (format === "object") {
    fieldExpr = concatList([
      fieldExpr.str.jsonPathMatch("$.lon").cast(DataType.Float64),
      fieldExpr.str.jsonPathMatch("$.lat").cast(DataType.Float64),
    ]).alias(field.name)
  }

  return fieldExpr
}

export function stringifyGeopointField(field: GeopointField, fieldExpr: Expr) {
  // Default format is "lon,lat" string
  const format = field.format ?? "default"

  if (format === "default") {
    return fieldExpr.cast(DataType.List(DataType.String)).lst.join(",")
  }

  if (format === "array") {
    return concatString(
      [
        lit("["),
        fieldExpr.lst.get(0).cast(DataType.String),
        lit(","),
        fieldExpr.lst.get(1).cast(DataType.String),
        lit("]"),
      ],
      "",
    ).alias(field.name) as Expr
  }

  if (format === "object") {
    return concatString(
      [
        lit('{"lon":'),
        fieldExpr.lst.get(0).cast(DataType.String),
        lit(',"lat":'),
        fieldExpr.lst.get(1).cast(DataType.String),
        lit("}"),
      ],
      "",
    ).alias(field.name) as Expr
  }

  return fieldExpr
}
