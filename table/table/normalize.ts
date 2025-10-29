import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { lit } from "nodejs-polars"
import { normalizeField } from "../field/index.ts"
import { matchSchemaField } from "../schema/index.ts"
import { getPolarsSchema } from "../schema/index.ts"
import type { SchemaMapping } from "../schema/index.ts"
import type { Table } from "./Table.ts"

const HEAD_ROWS = 100

export async function normalizeTable(table: Table, schema: Schema) {
  const head = await table.head(HEAD_ROWS).collect()
  const polarsSchema = getPolarsSchema(head.schema)

  const schemaMapping = { source: polarsSchema, target: schema }
  return table.select(...Object.values(normalizeFields(schemaMapping)))
}

export function normalizeFields(schemaMapping: SchemaMapping) {
  const exprs: Record<string, Expr> = {}

  for (const [index, field] of schemaMapping.target.fields.entries()) {
    const fieldMapping = matchSchemaField(schemaMapping, field, index)
    let expr = lit(null).alias(field.name)

    if (fieldMapping) {
      const missingValues =
        field.missingValues ?? schemaMapping.target.missingValues
      const mergedField = { ...field, missingValues }

      const column = { source: fieldMapping.source, target: mergedField }
      expr = normalizeField(column)
    }

    exprs[field.name] = expr
  }

  return exprs
}
