import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit, when } from "nodejs-polars"

// TODO: Handle schema.primaryKey and schema.uniqueKeys as well
export function isCellUniqueError(field: Field, target: Expr) {
  const unique = field.constraints?.unique

  if (unique === undefined) {
    return lit(false)
  }

  return when(target.isNotNull())
    .then(target.isFirstDistinct().not())
    .otherwise(lit(false))
}
