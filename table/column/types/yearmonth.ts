import type { YearmonthField } from "@dpkit/core"
import { DataType, col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

export function parseYearmonthColumn(
  field: YearmonthField,
  options?: { expr?: Expr },
) {
  let expr = options?.expr ?? col(field.name)

  // Trim whitespace
  expr = expr.str.strip()

  expr = expr.str.split("-").cast(DataType.List(DataType.Int16))
  // TODO:
  // Add more validation:
  // - Check the length of the list is 2 (no list.lenghts in polars currently)
  // - Check the values are year and month limits
  // - Return null instead of list if any of the values are out of range

  return expr
}
