import type { Expr } from "nodejs-polars"
import { DataType } from "nodejs-polars"
import type { FieldMapping } from "./Mapping.ts"
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

export function parseField(mapping: FieldMapping, fieldExpr: Expr) {
  if (!mapping.source.type.equals(DataType.String)) return fieldExpr

  const field = mapping.target
  switch (field.type) {
    case "array":
      return parseArrayField(field, fieldExpr)
    case "boolean":
      return parseBooleanField(field, fieldExpr)
    case "date":
      return parseDateField(field, fieldExpr)
    case "datetime":
      return parseDatetimeField(field, fieldExpr)
    case "duration":
      return parseDurationField(field, fieldExpr)
    case "geojson":
      return parseGeojsonField(field, fieldExpr)
    case "geopoint":
      return parseGeopointField(field, fieldExpr)
    case "integer":
      return parseIntegerField(field, fieldExpr)
    case "list":
      return parseListField(field, fieldExpr)
    case "number":
      return parseNumberField(field, fieldExpr)
    case "object":
      return parseObjectField(field, fieldExpr)
    case "string":
      return parseStringField(field, fieldExpr)
    case "time":
      return parseTimeField(field, fieldExpr)
    case "year":
      return parseYearField(field, fieldExpr)
    case "yearmonth":
      return parseYearmonthField(field, fieldExpr)
    default:
      return fieldExpr
  }
}
