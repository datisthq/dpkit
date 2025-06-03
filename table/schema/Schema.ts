import type { DataType } from "nodejs-polars"

export type PolarsSchema = string[] | Record<string, DataType>
