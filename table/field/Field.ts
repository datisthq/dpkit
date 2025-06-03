import type { DataType } from "nodejs-polars"

export interface PolarsField {
  name: string
  type: DataType
}
