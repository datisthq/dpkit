import type { Field, Schema } from "@dpkit/core"
import { col } from "nodejs-polars"
import { getPolarsFields } from "../polars/index.js"
import type { Table } from "../table/index.js"

export async function inferSchema(props: {
  table: Table
  sampleSize?: number
  confidence?: number
}) {
  const { table, sampleSize = 100, confidence = 0.9 } = props
  const schema: Schema = {
    fields: [],
  }

  const sample = await table.head(sampleSize).collect()
  const polarsFields = getPolarsFields({ polarsSchema: sample.schema })

  for (const polarsField of polarsFields) {
    const name = polarsField.name
    const type = TYPE_MAPPING[polarsField.type.variant] ?? "any"

    let field = { name, type }

    if (type === "string") {
      for (const [regex, patch] of Object.entries(REGEX_MAPPING)) {
        const matches = sample.filter(col(name).str.contains(regex)).height
        if (matches / sample.height >= confidence) {
          field = { ...field, ...patch }
          break
        }
      }
    }

    schema.fields.push(field)
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

const REGEX_MAPPING: Record<string, Record<string, string>> = {
  "^\\d+$": { type: "integer" },
  "^[,\\d]+$": { type: "integer", groupChar: "," },
}
