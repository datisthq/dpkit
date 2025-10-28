import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
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

export function parseField(field: Field, fieldExpr?: Expr) {
  const expr = fieldExpr ?? col(field.name)

  switch (field.type) {
    case "array":
      return parseArrayField(field, expr)
    case "boolean":
      return parseBooleanField(field, expr)
    case "date":
      return parseDateField(field, expr)
    case "datetime":
      return parseDatetimeField(field, expr)
    case "duration":
      return parseDurationField(field, expr)
    case "geojson":
      return parseGeojsonField(field, expr)
    case "geopoint":
      return parseGeopointField(field, expr)
    case "integer":
      return parseIntegerField(field, expr)
    case "list":
      return parseListField(field, expr)
    case "number":
      return parseNumberField(field, expr)
    case "object":
      return parseObjectField(field, expr)
    case "string":
      return parseStringField(field, expr)
    case "time":
      return parseTimeField(field, expr)
    case "year":
      return parseYearField(field, expr)
    case "yearmonth":
      return parseYearmonthField(field, expr)
    default:
      return expr
  }
}
