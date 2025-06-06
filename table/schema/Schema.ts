import type { DataType } from "nodejs-polars"
import type { PolarsField } from "../field/index.js"

export interface PolarsSchema {
  fields: PolarsField[]
}

export function getPolarsSchema(props: {
  typeMapping: Record<string, DataType>
}): PolarsSchema {
  const entries = Object.entries(props.typeMapping)
  const fields = entries.map(([name, type]) => ({ name, type }))

  return { fields }
}
