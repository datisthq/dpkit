import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
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

export function parseField(field: Field, options?: { expr?: Expr }) {
  let expr = options?.expr ?? col(field.name)

  const missingValues = field.missingValues ?? DEFAULT_MISSING_VALUES
  for (const source of missingValues) {
    const target = typeof source === "string" ? source : source.value
    if (target) expr = expr.str.replaceAll(`^${escapeRegex(target)}$`, "")
  }

  switch (field.type) {
    case "string":
      return parseStringField(field, { expr })
    case "integer":
      return parseIntegerField(field, { expr })
    case "number":
      return parseNumberField(field, { expr })
    case "boolean":
      return parseBooleanField(field, { expr })
    case "date":
      return parseDateField(field, { expr })
    case "datetime":
      return parseDatetimeField(field, { expr })
    case "time":
      return parseTimeField(field, { expr })
    case "year":
      return parseYearField(field, { expr })
    case "yearmonth":
      return parseYearmonthField(field, { expr })
    case "list":
      return parseListField(field, { expr })
    case "array":
      return parseArrayField(field, { expr })
    case "geopoint":
      return parseGeopointField(field, { expr })
    case "object":
      return parseObjectField(field, { expr })
    case "geojson":
      return parseGeojsonField(field, { expr })
    case "duration":
      return parseDurationField(field, { expr })
    default:
      return expr
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
