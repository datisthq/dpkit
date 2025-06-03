import type { Field } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { PolarsField } from "../Field.js"

export function convertFieldFromPolars(props: {
  polarsField: PolarsField
}): Field {
  const { name, type } = props.polarsField

  switch (type) {
    case DataType.Int8:
    case DataType.Int16:
    case DataType.Int32:
    case DataType.Int64:
    case DataType.UInt8:
    case DataType.UInt16:
    case DataType.UInt32:
    case DataType.UInt64:
      return {
        name,
        type: "integer",
      }

    case DataType.Float32:
    case DataType.Float64:
      return {
        name,
        type: "number",
      }

    case DataType.Bool:
      return {
        name,
        type: "boolean",
      }

    case DataType.Utf8:
      return {
        name,
        type: "string",
      }

    case DataType.Date:
      return {
        name,
        type: "date",
      }

    case DataType.Time:
      return {
        name,
        type: "time",
      }

    default:
      return {
        name,
        type: "any",
      }
  }
}
