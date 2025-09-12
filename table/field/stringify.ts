import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
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

const DEFAULT_MISSING_VALUE = ""

export function stringifyField(field: Field, expr?: Expr) {
  expr = expr ?? col(field.name)

  switch (field.type) {
    case "array":
      expr = stringifyArrayField(field, expr)
      break
    case "boolean":
      expr = stringifyBooleanField(field, expr)
      break
    case "date":
      expr = stringifyDateField(field, expr)
      break
    case "datetime":
      expr = stringifyDatetimeField(field, expr)
      break
    case "duration":
      expr = stringifyDurationField(field, expr)
      break
    case "geojson":
      expr = stringifyGeojsonField(field, expr)
      break
    case "geopoint":
      expr = stringifyGeopointField(field, expr)
      break
    case "integer":
      expr = stringifyIntegerField(field, expr)
      break
    case "list":
      expr = stringifyListField(field, expr)
      break
    case "number":
      expr = stringifyNumberField(field, expr)
      break
    case "object":
      expr = stringifyObjectField(field, expr)
      break
    case "string":
      expr = stringifyStringField(field, expr)
      break
    case "time":
      expr = stringifyTimeField(field, expr)
      break
    case "year":
      expr = stringifyYearField(field, expr)
      break
    case "yearmonth":
      expr = stringifyYearmonthField(field, expr)
      break
  }

  const flattenMissingValues = field.missingValues?.map(it =>
    typeof it === "string" ? it : it.value,
  )

  const missingValue = flattenMissingValues?.[0] ?? DEFAULT_MISSING_VALUE
  expr = when(expr.isNull())
    .then(lit(missingValue))
    .otherwise(expr)
    .alias(field.name)

  return expr
}
