import type { Field } from "@dpkit/core"
import { DataType } from "nodejs-polars"
import type { PolarsField } from "../Field.js"

export function convertFieldToPolars(props: { field: Field }): PolarsField {
  const { name, type } = props.field

  switch (type) {
    case "string":
      return {
        name,
        type: DataType.Utf8,
      }

    case "number":
      return {
        name,
        type: DataType.Float64,
      }

    case "integer":
      return {
        name,
        type: DataType.Int64,
      }

    case "boolean":
      return {
        name,
        type: DataType.Bool,
      }

    case "date":
      return {
        name,
        type: DataType.Date,
      }

    case "time":
      return {
        name,
        type: DataType.Time,
      }

    //case "datetime":
    //  return {
    //    name,
    //    type: DataType.Datetime,
    //  }
    //
    //case "array":
    //case "list":
    //case "geopoint":
    //  return {
    //    name,
    //    type: DataType.List,
    //  }
    //
    //case "object":
    //  return {
    //    name,
    //    type: DataType.Struct,
    //  }

    default:
      return {
        name,
        type: DataType.Object,
      }
  }
}
