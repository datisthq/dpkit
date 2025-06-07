import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

export function detectCellRequiredError(field: Field, target: Expr) {
  return field.constraints?.required ? target.isNull() : lit(false)
}
