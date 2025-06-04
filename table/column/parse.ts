import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseBooleanColumn } from "./types/boolean.js"
import { parseIntegerColumn } from "./types/integer.js"
import { parseNumberColumn } from "./types/number.js"

const DEFAULT_MISSING_VALUES = [""]

export function parseColumn(props: { field: Field; expr?: Expr }) {
  const { field } = props
  let expr = props.expr ?? col(field.name)

  const missingValues = field.missingValues ?? DEFAULT_MISSING_VALUES
  for (const source of missingValues) {
    const target = typeof source === "string" ? source : source.value
    if (target) expr = expr.str.replaceAll(`^${escapeRegex(target)}$`, "")
  }

  switch (field.type) {
    case "integer":
      return parseIntegerColumn({ field, expr })
    case "number":
      return parseNumberColumn({ field, expr })
    case "boolean":
      return parseBooleanColumn({ field, expr })
    default:
      return expr
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
