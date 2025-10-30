import type { Field } from "@dpkit/core"
import type { Expr } from "nodejs-polars"
import type { PolarsField } from "./Field.ts"

export interface FieldMapping {
  source: PolarsField
  target: Field
}

export interface CellMapping {
  source: Expr
  target: Expr
}
