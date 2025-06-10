import type { DataType } from "nodejs-polars"
import type { PolarsField } from "../field/index.js"

export interface PolarsSchema {
  fields: PolarsField[]
}

export function getPolarsSchema(
  typeMapping: Record<string, DataType>,
): PolarsSchema {
  const entries = Object.entries(typeMapping)
  const fields = entries.map(([name, type]) => ({ name, type }))

  return { fields }
}
