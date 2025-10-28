import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { stringifyArrayField } from "./types/array.ts"
import { stringifyBooleanField } from "./types/boolean.ts"
import { stringifyDateField } from "./types/date.ts"
import { stringifyDatetimeField } from "./types/datetime.ts"
import { stringifyDurationField } from "./types/duration.ts"
import { stringifyGeojsonField } from "./types/geojson.ts"
import { stringifyGeopointField } from "./types/geopoint.ts"
import { stringifyIntegerField } from "./types/integer.ts"
import { stringifyListField } from "./types/list.ts"
import { stringifyNumberField } from "./types/number.ts"
import { stringifyObjectField } from "./types/object.ts"
import { stringifyStringField } from "./types/string.ts"
import { stringifyTimeField } from "./types/time.ts"
import { stringifyYearField } from "./types/year.ts"
import { stringifyYearmonthField } from "./types/yearmonth.ts"

export function stringifyField(field: Field, fieldExpr?: Expr) {
  const expr = fieldExpr ?? col(field.name)

  switch (field.type) {
    case "array":
      return stringifyArrayField(field, expr)
    case "boolean":
      return stringifyBooleanField(field, expr)
    case "date":
      return stringifyDateField(field, expr)
    case "datetime":
      return stringifyDatetimeField(field, expr)
    case "duration":
      return stringifyDurationField(field, expr)
    case "geojson":
      return stringifyGeojsonField(field, expr)
    case "geopoint":
      return stringifyGeopointField(field, expr)
    case "integer":
      return stringifyIntegerField(field, expr)
    case "list":
      return stringifyListField(field, expr)
    case "number":
      return stringifyNumberField(field, expr)
    case "object":
      return stringifyObjectField(field, expr)
    case "string":
      return stringifyStringField(field, expr)
    case "time":
      return stringifyTimeField(field, expr)
    case "year":
      return stringifyYearField(field, expr)
    case "yearmonth":
      return stringifyYearmonthField(field, expr)
    default:
      return expr
  }
}
