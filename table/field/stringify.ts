import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { Expr } from "nodejs-polars"

const DEFAULT_MISSING_VALUES = [""]

export function stringifyField(field: Field, expr?: Expr) {
  expr = expr ?? col(field.name)

  switch (field.type) {
    case "integer":
      expr = stringifyIntegerField(field, expr)
      break
    case "number":
      expr = stringifyNumberField(field, expr)
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
    case "time":
      expr = stringifyTimeField(field, expr)
      break
    case "year":
      expr = stringifyYearField(field, expr)
      break
    case "yearmonth":
      expr = stringifyYearmonthField(field, expr)
      break
    case "list":
      expr = stringifyListField(field, expr)
      break
    case "array":
      expr = stringifyArrayField(field, expr)
      break
    case "geopoint":
      expr = stringifyGeopointField(field, expr)
      break
    case "object":
      expr = stringifyObjectField(field, expr)
      break
    case "geojson":
      expr = stringifyGeojsonField(field, expr)
      break
    case "duration":
      expr = stringifyDurationField(field, expr)
      break
  }

  const flattenMissingValues =
    field.missingValues?.map(it => (typeof it === "string" ? it : it.value)) ??
    DEFAULT_MISSING_VALUES

  const missingValue = flattenMissingValues[0]
  if (missingValue) {
    expr = when(expr.isNull())
      .then(lit(missingValue))
      .otherwise(expr)
      .alias(field.name)
  }

  return expr
}
