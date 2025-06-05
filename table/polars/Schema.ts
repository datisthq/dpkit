import type { DataType } from "nodejs-polars"

export type PolarsSchema = Record<string, DataType>

export function getPolarsFields(props: { polarsSchema: PolarsSchema }) {
  return Object.entries(props.polarsSchema).map(([name, type]) => ({
    name,
    type,
  }))
}
