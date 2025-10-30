import { col } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"
import { narrowField } from "./narrow.ts"
import { parseField } from "./parse.ts"
import { substituteField } from "./substitute.ts"

export function normalizeField(
  mapping: FieldMapping,
  options?: { keepType?: boolean },
) {
  let fieldExpr = col(mapping.source.name)
  fieldExpr = substituteField(mapping, fieldExpr)

  if (!options?.keepType) {
    fieldExpr = parseField(mapping, fieldExpr)
    fieldExpr = narrowField(mapping, fieldExpr)
  }

  return fieldExpr.alias(mapping.target.name)
}
