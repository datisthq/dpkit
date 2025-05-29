import type { DataType } from "nodejs-polars"

export type PolarsSchema = Record<string, string | DataType>
