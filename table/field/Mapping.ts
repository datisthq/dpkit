import type { Field } from "@dpkit/metadata"
import type * as pl from "nodejs-polars"
import type { PolarsField } from "./Field.ts"

export interface FieldMapping {
  source: PolarsField
  target: Field
}

export interface CellMapping {
  source: pl.Expr
  target: pl.Expr
}
