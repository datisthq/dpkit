import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"

// TODO: Support other types
export function isCellMinimumError(field: Field, target: Expr) {
  if (!["integer", "number"].includes(field.type ?? "")) {
    return lit(false)
  }

  return field.constraints?.required ? target.isNull() : lit(false)
}
