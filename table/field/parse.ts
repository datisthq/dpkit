import type { Field, Schema } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseArrayField } from "./types/array.js"
import { parseBooleanField } from "./types/boolean.js"
import { parseDateField } from "./types/date.js"
import { parseDatetimeField } from "./types/datetime.js"
import { parseDurationField } from "./types/duration.js"
import { parseGeojsonField } from "./types/geojson.js"
import { parseGeopointField } from "./types/geopoint.js"
import { parseIntegerField } from "./types/integer.js"
import { parseListField } from "./types/list.js"
import { parseNumberField } from "./types/number.js"
import { parseObjectField } from "./types/object.js"
import { parseStringField } from "./types/string.js"
import { parseTimeField } from "./types/time.js"
import { parseYearField } from "./types/year.js"
import { parseYearmonthField } from "./types/yearmonth.js"

const DEFAULT_MISSING_VALUES = [""]

export function parseField(
  field: Field,
  options?: { expr?: Expr; schema?: Schema },
) {
  let expr = options?.expr ?? col(field.name)

  const missingValues =
    field.missingValues ??
    options?.schema?.missingValues ??
    DEFAULT_MISSING_VALUES

  const flattenMissingValues = missingValues.map(item =>
    typeof item === "string" ? item : item.value,
  )

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
      return parseIntegerField(field, expr)
    case "number":
      return parseNumberField(field, expr)
    case "boolean":
      return parseBooleanField(field, expr)
    case "date":
      return parseDateField(field, expr)
    case "datetime":
      return parseDatetimeField(field, expr)
    case "time":
      return parseTimeField(field, expr)
    case "year":
      return parseYearField(field, expr)
    case "yearmonth":
      return parseYearmonthField(field, expr)
    case "list":
      return parseListField(field, expr)
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
