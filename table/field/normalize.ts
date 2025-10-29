import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"
import { parseField } from "./parse.ts"
import { substituteField } from "./substitute.ts"

export function normalizeField(
  mapping: FieldMapping,
  options?: { keepType?: boolean },
) {
  let fieldExpr = col(mapping.source.name)

  if (mapping.source.type.equals(DataType.String)) {
    fieldExpr = substituteField(mapping.target, fieldExpr)

    if (!options?.keepType) {
      fieldExpr = parseField(mapping.target, fieldExpr)
    }
  }

  return fieldExpr.alias(mapping.target.name)
}
