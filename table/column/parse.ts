import type { Field } from "@dpkit/core"
import { col } from "nodejs-polars"
import type { Expr } from "nodejs-polars"
import { parseArrayColumn } from "./types/array.js"
import { parseBooleanColumn } from "./types/boolean.js"
import { parseDateColumn } from "./types/date.js"
import { parseDatetimeColumn } from "./types/datetime.js"
import { parseDurationColumn } from "./types/duration.js"
import { parseGeojsonColumn } from "./types/geojson.js"
import { parseGeopointColumn } from "./types/geopoint.js"
import { parseIntegerColumn } from "./types/integer.js"
import { parseListColumn } from "./types/list.js"
import { parseNumberColumn } from "./types/number.js"
import { parseObjectColumn } from "./types/object.js"
import { parseTimeColumn } from "./types/time.js"
import { parseYearColumn } from "./types/year.js"
import { parseYearmonthColumn } from "./types/yearmonth.js"

const DEFAULT_MISSING_VALUES = [""]

export function parseColumn(field: Field, options?: { expr?: Expr }) {
  let expr = options?.expr ?? col(field.name)

  const missingValues = field.missingValues ?? DEFAULT_MISSING_VALUES
  for (const source of missingValues) {
    const target = typeof source === "string" ? source : source.value
    if (target) expr = expr.str.replaceAll(`^${escapeRegex(target)}$`, "")
  }

  switch (field.type) {
    case "integer":
      return parseIntegerColumn(field, { expr })
    case "number":
      return parseNumberColumn(field, { expr })
    case "boolean":
      return parseBooleanColumn(field, { expr })
    case "date":
      return parseDateColumn(field, { expr })
    case "datetime":
      return parseDatetimeColumn(field, { expr })
    case "time":
      return parseTimeColumn(field, { expr })
    case "year":
      return parseYearColumn(field, { expr })
    case "yearmonth":
      return parseYearmonthColumn(field, { expr })
    case "list":
      return parseListColumn(field, { expr })
    case "array":
      return parseArrayColumn(field, { expr })
    case "geopoint":
      return parseGeopointColumn(field, { expr })
    case "object":
      return parseObjectColumn(field, { expr })
    case "geojson":
      return parseGeojsonColumn(field, { expr })
    case "duration":
      return parseDurationColumn(field, { expr })
    default:
      return expr
  }
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
