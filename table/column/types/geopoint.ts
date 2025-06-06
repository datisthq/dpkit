import type { GeopointField } from "@dpkit/core"
import { DataType, col, lit } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseGeopointColumn(
  field: GeopointField,
  options?: { expr?: Expr },
) {
  let expr = options?.expr ?? col(field.name)

  // Trim whitespace
  expr = expr.str.strip()

  // Default format is "lon,lat" string
  const format = field.format || "default"

  if (format === "default") {
    expr = expr.str.split(",").cast(DataType.List(DataType.Float64))
    // TODO:
    // Add more validation:
    // - Check the length of the list is 2 (no list.lenghts in polars currently)
    // - Check the values are within -180..180 and -90..90
    // - Return null instead of list if any of the values are out of range
  }

  if (format === "object") {
    // TODO: implement
    expr = lit(null).alias(field.name)
  }

  if (format === "array") {
    // TODO: implement
    expr = lit(null).alias(field.name)
  }

  return expr
}
