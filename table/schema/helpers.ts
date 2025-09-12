import type { DataType } from "nodejs-polars"
import type { PolarsSchema } from "./Schema.ts"

export function getPolarsSchema(
  typeMapping: Record<string, DataType>,
): PolarsSchema {
  const entries = Object.entries(typeMapping)
  const fields = entries.map(([name, type]) => ({ name, type }))

  return { fields }
}
