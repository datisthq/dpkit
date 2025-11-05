import type { Field } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import { desubstituteField } from "./desubstitute.ts"
import { stringifyField } from "./stringify.ts"

export type DenormalizeFieldOptions = {
  nativeTypes?: Exclude<Field["type"], undefined>[]
}

export function denormalizeField(
  field: Field,
  options?: DenormalizeFieldOptions,
) {
  let expr = pl.col(field.name)
  const { nativeTypes } = options ?? {}

  if (!nativeTypes?.includes(field.type ?? "any")) {
    expr = stringifyField(field, expr)
    expr = desubstituteField(field, expr)
  }

  return expr
}
