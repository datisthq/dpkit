import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { denormalizeField } from "../field/index.ts"
import type { DenormalizeFieldOptions } from "../field/index.ts"
import type { Table } from "./Table.ts"

export async function denormalizeTable(
  table: Table,
  schema: Schema,
  options?: DenormalizeFieldOptions,
) {
  return table.select(...Object.values(denormalizeFields(schema, options)))
}

export function denormalizeFields(
  schema: Schema,
  options?: DenormalizeFieldOptions,
) {
  const exprs: Record<string, Expr> = {}

  for (const field of schema.fields) {
    const missingValues = field.missingValues ?? schema.missingValues
    const mergedField = { ...field, missingValues }

    const expr = denormalizeField(mergedField, options)
    exprs[field.name] = expr
  }

  return exprs
}
