import type { Field, Schema } from "@dpkit/core"
import { getPolarsFields } from "../polars/index.js"
import type { Table } from "../table/index.js"

export async function inferSchema(props: {
  table: Table
  sampleSize?: number
}) {
  const { table, sampleSize = 100 } = props
  const schema: Schema = {
    fields: [],
  }

  const sample = await table.head(sampleSize).collect()
  const polarsFields = getPolarsFields({ polarsSchema: sample.schema })

  for (const polarsField of polarsFields) {
    const name = polarsField.name
    const type = TYPE_MAPPING[polarsField.type.variant] ?? "any"

    schema.fields.push({ name, type })
  }

  return schema
}

const TYPE_MAPPING: Record<string, Field["type"]> = {
  Array: "array",
  Bool: "boolean",
  Categorical: "string",
  Date: "date",
  Datetime: "datetime",
  Decimal: "number",
  Float32: "number",
  Float64: "number",
  Int16: "integer",
  Int32: "integer",
  Int64: "integer",
  Int8: "integer",
  List: "array",
  Null: "any",
  Object: "object",
  String: "string",
  Struct: "object",
  Time: "time",
  UInt16: "integer",
  UInt32: "integer",
  UInt64: "integer",
  UInt8: "integer",
  Utf8: "string",
}
