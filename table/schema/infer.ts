import type { Field, Schema } from "@dpkit/metadata"
import * as pl from "nodejs-polars"
import { getPolarsSchema } from "../schema/index.ts"
import type { Table } from "../table/index.ts"
import type { SchemaOptions } from "./Options.ts"

// TODO: Implement actual options usage for inferring
// TODO: Review default values being {fields: []} vs undefined

export interface InferSchemaOptions extends SchemaOptions {
  sampleRows?: number
  confidence?: number
  commaDecimal?: boolean
  monthFirst?: boolean
  keepStrings?: boolean
}

export async function inferSchemaFromTable(
  table: Table,
  options?: InferSchemaOptions,
) {
  const { sampleRows = 100 } = options ?? {}

  const sample = await table.head(sampleRows).collect()
  return inferSchemaFromSample(sample, options)
}

export function inferSchemaFromSample(
  sample: pl.DataFrame,
  options?: Exclude<InferSchemaOptions, "sampleRows">,
) {
  const { confidence = 0.9, fieldTypes, keepStrings } = options ?? {}

  const typeMapping = createTypeMapping()
  const regexMapping = createRegexMapping(options)

  const polarsSchema = getPolarsSchema(sample.schema)
  const fieldNames = options?.fieldNames ?? polarsSchema.fields.map(f => f.name)

  const failureThreshold =
    sample.height - Math.floor(sample.height * confidence) || 1

  const schema: Schema = {
    fields: [],
  }

  for (const name of fieldNames) {
    const polarsField = polarsSchema.fields.find(f => f.name === name)
    if (!polarsField) {
      throw new Error(`Field "${name}" not found in the table`)
    }

    // TODO: Remove this workaround once the issue is fixed
    // https://github.com/pola-rs/nodejs-polars/issues/372
    let variant = polarsField.type.variant as string
    if (!typeMapping[variant]) {
      variant = variant.slice(0, -1)
    }

    const type = fieldTypes?.[name] ?? typeMapping[variant] ?? "any"
    let field = { name, type }

    if (!fieldTypes?.[name]) {
      if (type === "array") {
        if (options?.arrayType === "list") {
          field.type = "list"
        }
      }

      if (type === "string") {
        if (!keepStrings) {
          for (const [regex, patch] of Object.entries(regexMapping)) {
            const failures = sample
              .filter(pl.col(name).str.contains(regex).not())
              .head(failureThreshold).height

            if (failures < failureThreshold) {
              field = { ...field, ...patch }
              break
            }
          }
        }
      }

      if (type === "number") {
        const failures = sample
          .filter(pl.col(name).eq(pl.col(name).round(0)).not())
          .head(failureThreshold).height

        if (failures < failureThreshold) {
          field.type = "integer"
        }
      }
    }

    enhanceField(field, options)
    schema.fields.push(field)
  }

  enhanceSchema(schema, options)
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

function createRegexMapping(options?: InferSchemaOptions) {
  const { commaDecimal, monthFirst } = options ?? {}

  const mapping: Record<string, Partial<Field>> = {
    // Numeric
    "^\\d+$": { type: "integer" },
    "^\\d{1,3}(,\\d{3})+$": commaDecimal
      ? { type: "number" }
      : { type: "integer", groupChar: "," },
    "^\\d+\\.\\d+$": commaDecimal
      ? { type: "integer", groupChar: "." }
      : { type: "number" },
    "^\\d{1,3}(,\\d{3})+\\.\\d+$": { type: "number", groupChar: "," },
    "^\\d{1,3}(\\.\\d{3})+,\\d+$": {
      type: "number",
      groupChar: ".",
      decimalChar: ",",
    },

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

    // List
    // TODO: Support commaDecimal
    "^\\d+,\\d+$": { type: "list", itemType: "integer" },
    "^[\\d.]+,[\\d.]+$": { type: "list", itemType: "number" },
  }

  return mapping
}

function enhanceField(field: Field, options?: InferSchemaOptions) {
  if (field.type === "string") {
    field.format = options?.stringFormat ?? field.format
  } else if (field.type === "integer") {
    field.groupChar = options?.groupChar ?? field.groupChar
    field.bareNumber = options?.bareNumber ?? field.bareNumber
  } else if (field.type === "number") {
    field.decimalChar = options?.decimalChar ?? field.decimalChar
    field.groupChar = options?.groupChar ?? field.groupChar
    field.bareNumber = options?.bareNumber ?? field.bareNumber
  } else if (field.type === "boolean") {
    field.trueValues = options?.trueValues ?? field.trueValues
    field.falseValues = options?.falseValues ?? field.falseValues
  } else if (field.type === "datetime") {
    field.format = options?.datetimeFormat ?? field.format
  } else if (field.type === "date") {
    field.format = options?.dateFormat ?? field.format
  } else if (field.type === "time") {
    field.format = options?.timeFormat ?? field.format
  } else if (field.type === "list") {
    field.delimiter = options?.listDelimiter ?? field.delimiter
    field.itemType = options?.listItemType ?? field.itemType
  } else if (field.type === "geopoint") {
    field.format = options?.geopointFormat ?? field.format
  } else if (field.type === "geojson") {
    field.format = options?.geojsonFormat ?? field.format
  }
}

function enhanceSchema(schema: Schema, options?: InferSchemaOptions) {
  schema.missingValues = options?.missingValues ?? schema.missingValues
}
