import { DataType } from "nodejs-polars"
import { col } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"
import { parseField } from "./parse.ts"
import { substituteField } from "./substitute.ts"

export function normalizeField(mapping: FieldMapping) {
  let expr = col(mapping.source.name)

  if (mapping.source.type.equals(DataType.String)) {
    expr = substituteField(mapping.target, expr)
    expr = parseField(mapping.target, expr)
  }

  return expr.alias(mapping.target.name)
}
