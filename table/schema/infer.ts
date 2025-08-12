import type { Field, Schema } from "@dpkit/core"
import { col } from "nodejs-polars"
import { getPolarsSchema } from "../schema/index.ts"
import type { Table } from "../table/index.ts"

export type InferSchemaOptions = {
  sampleRows?: number
  confidence?: number
  commaDecimal?: boolean
  monthFirst?: boolean
}

export async function inferSchema(table: Table, options?: InferSchemaOptions) {
  const { sampleRows = 100, confidence = 0.9 } = options ?? {}
  const schema: Schema = {
    fields: [],
  }

  const typeMapping = createTypeMapping()
  const regexMapping = createRegexMapping(options)

  const sample = await table.head(sampleRows).collect()
  const polarsSchema = getPolarsSchema(sample.schema)

  const failureThreshold =
    sample.height - Math.floor(sample.height * confidence) || 1

  for (const polarsField of polarsSchema.fields) {
    const name = polarsField.name
    const type = typeMapping[polarsField.type.variant] ?? "any"

    let field = { name, type }

    if (type === "string") {
      for (const [regex, patch] of Object.entries(regexMapping)) {
        const failures = sample
          .filter(col(name).str.contains(regex).not())
          .head(failureThreshold).height
        if (failures < failureThreshold) {
          field = { ...field, ...patch }
          break
        }
      }
    }

    schema.fields.push(field)
  }

  return schema
}

function createTypeMapping() {
  const mapping: Record<string, Field["type"]> = {
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

  return mapping
}

function createRegexMapping(options?: {
  commaDecimal?: boolean
  monthFirst?: boolean
}) {
  const { commaDecimal, monthFirst } = options ?? {}

  const mapping: Record<string, Partial<Field>> = {
    // Numeric
    "^\\d+$": { type: "integer" },
    "^[,\\d]+$": commaDecimal
      ? { type: "number" }
      : { type: "integer", groupChar: "," },
    "^\\d+\\.\\d+$": commaDecimal
      ? { type: "integer", groupChar: "." }
      : { type: "number" },
    "^[,\\d]+\\.\\d+$": { type: "number", groupChar: "," },
    "^[.\\d]+\\,\\d+$": { type: "number", groupChar: ".", decimalChar: "," },

    // Boolean
    "^(true|True|TRUE|false|False|FALSE)$": { type: "boolean" },

    // Date
    "^\\d{4}-\\d{2}-\\d{2}$": { type: "date" },
    "^\\d{4}/\\d{2}/\\d{2}$": { type: "date", format: "%Y/%m/%d" },
    "^\\d{2}/\\d{2}/\\d{4}$": monthFirst
      ? { type: "date", format: "%m/%d/%Y" }
      : { type: "date", format: "%d/%m/%Y" },
    "^\\d{2}-\\d{2}-\\d{4}$": monthFirst
      ? { type: "date", format: "%m-%d-%Y" }
      : { type: "date", format: "%d-%m-%Y" },
    "^\\d{2}\\.\\d{2}\\.\\d{4}$": monthFirst
      ? { type: "date", format: "%m.%d.%Y" }
      : { type: "date", format: "%d.%m.%Y" },

    // Time
    "^\\d{2}:\\d{2}:\\d{2}$": { type: "time" },
    "^\\d{2}:\\d{2}$": { type: "time", format: "%H:%M" },
    "^\\d{1,2}:\\d{2}:\\d{2}\\s*(am|pm|AM|PM)$": {
      type: "time",
      format: "%I:%M:%S %p",
    },
    "^\\d{1,2}:\\d{2}\\s*(am|pm|AM|PM)$": { type: "time", format: "%I:%M %p" },
    "^\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:?\\d{2}$": { type: "time" },

    // Datetime - ISO format
    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z?$": { type: "datetime" },
    "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:?\\d{2}$": {
      type: "datetime",
    },
    "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$": {
      type: "datetime",
      format: "%Y-%m-%d %H:%M:%S",
    },
    "^\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}$": monthFirst
      ? { type: "datetime", format: "%m/%d/%Y %H:%M" }
      : { type: "datetime", format: "%d/%m/%Y %H:%M" },
    "^\\d{2}/\\d{2}/\\d{4} \\d{2}:\\d{2}:\\d{2}$": monthFirst
      ? { type: "datetime", format: "%m/%d/%Y %H:%M:%S" }
      : { type: "datetime", format: "%d/%m/%Y %H:%M:%S" },

    // Object
    "^\\{": { type: "object" },

    // Array
    "^\\[": { type: "array" },
  }

  return mapping
}
