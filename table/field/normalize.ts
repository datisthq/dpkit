import type { Schema } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import { col, lit } from "nodejs-polars"
import { matchField } from "../field/index.ts"
import { parseField } from "../field/index.ts"
import type { PolarsSchema } from "../schema/index.ts"

export function normalizeFields(
  schema: Schema,
  polarsSchema: PolarsSchema,
  options?: { noParse?: boolean },
) {
  const exprs: Record<string, Expr> = {}

  for (const [index, field] of schema.fields.entries()) {
    const polarsField = matchField(index, field, schema, polarsSchema)
    let expr = lit(null).alias(field.name)

    if (polarsField) {
      expr = col(polarsField.name).alias(field.name)

      if (!options?.noParse && polarsField.type.equals(DataType.String)) {
        expr = parseField(field, { expr, schema })
      }
    }

    exprs[field.name] = expr
  }

  return exprs
}
