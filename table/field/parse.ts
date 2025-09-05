import type { Field, GeopointField, ListField } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseArrayField } from "./types/array.ts"
import { parseBooleanField } from "./types/boolean.ts"
import { parseDateField } from "./types/date.ts"
import { parseDatetimeField } from "./types/datetime.ts"
import { parseDurationField } from "./types/duration.ts"
import { parseGeojsonField } from "./types/geojson.ts"
import { parseGeopointField } from "./types/geopoint.ts"
import { parseIntegerField } from "./types/integer.ts"
import { parseListField } from "./types/list.ts"
import { parseNumberField } from "./types/number.ts"
import { parseObjectField } from "./types/object.ts"
import { parseStringField } from "./types/string.ts"
import { parseTimeField } from "./types/time.ts"
import { parseYearField } from "./types/year.ts"
import { parseYearmonthField } from "./types/yearmonth.ts"

export type ParseFieldOptions = {
  missingValues?: string[]
  decimalChar?: string
  groupChar?: string
  bareNumber?: boolean
  trueValues?: string[]
  falseValues?: string[]
  datetimeFormat?: string
  dateFormat?: string
  timeFormat?: string
  listDelimiter?: string
  listItemType?: ListField["itemType"]
  geopointFormat?: GeopointField["format"]
}

const DEFAULT_MISSING_VALUES = [""]

export function parseField(
  field: Field,
  expr?: Expr,
  options?: ParseFieldOptions,
) {
  expr = expr ?? col(field.name)

  const flattenMissingValues =
    field.missingValues?.map(it => (typeof it === "string" ? it : it.value)) ??
    options?.missingValues ??
    DEFAULT_MISSING_VALUES

  if (flattenMissingValues.length) {
    expr = when(expr.isIn(flattenMissingValues))
      .then(lit(null))
      .otherwise(expr)
      .alias(field.name)
  }

  switch (field.type) {
    case "string":
      return parseStringField(field, expr)
    case "integer":
      return parseIntegerField(field, expr, options)
    case "number":
      return parseNumberField(field, expr, options)
    case "boolean":
      return parseBooleanField(field, expr, options)
    case "date":
      return parseDateField(field, expr, options)
    case "datetime":
      return parseDatetimeField(field, expr, options)
    case "time":
      return parseTimeField(field, expr, options)
    case "year":
      return parseYearField(field, expr)
    case "yearmonth":
      return parseYearmonthField(field, expr)
    case "list":
      return parseListField(field, expr, options)
    case "array":
      return parseArrayField(field, expr)
    case "geopoint":
      return parseGeopointField(field, expr)
    case "object":
      return parseObjectField(field, expr)
    case "geojson":
      return parseGeojsonField(field, expr)
    case "duration":
      return parseDurationField(field, expr)
    default:
      return expr
  }
}
