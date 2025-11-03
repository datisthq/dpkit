import type { Field } from "@dpkit/core"
import type * as pl from "nodejs-polars"
import { stringifyBooleanField } from "./types/boolean.ts"
import { stringifyDateField } from "./types/date.ts"
import { stringifyDatetimeField } from "./types/datetime.ts"
import { stringifyDurationField } from "./types/duration.ts"
import { stringifyGeopointField } from "./types/geopoint.ts"
import { stringifyIntegerField } from "./types/integer.ts"
import { stringifyListField } from "./types/list.ts"
import { stringifyNumberField } from "./types/number.ts"
import { stringifyStringField } from "./types/string.ts"
import { stringifyTimeField } from "./types/time.ts"
import { stringifyYearField } from "./types/year.ts"
import { stringifyYearmonthField } from "./types/yearmonth.ts"

export function stringifyField(field: Field, fieldExpr: pl.Expr) {
  switch (field.type) {
    case "boolean":
      return stringifyBooleanField(field, fieldExpr)
    case "date":
      return stringifyDateField(field, fieldExpr)
    case "datetime":
      return stringifyDatetimeField(field, fieldExpr)
    case "duration":
      return stringifyDurationField(field, fieldExpr)
    case "geopoint":
      return stringifyGeopointField(field, fieldExpr)
    case "integer":
      return stringifyIntegerField(field, fieldExpr)
    case "list":
      return stringifyListField(field, fieldExpr)
    case "number":
      return stringifyNumberField(field, fieldExpr)
    case "string":
      return stringifyStringField(field, fieldExpr)
    case "time":
      return stringifyTimeField(field, fieldExpr)
    case "year":
      return stringifyYearField(field, fieldExpr)
    case "yearmonth":
      return stringifyYearmonthField(field, fieldExpr)
    default:
      return fieldExpr
  }
}
